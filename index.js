/*
 * ORION X - Root Entry Point (index.js)
 *
 * Fuer Pterodactyl / Docker-Hosting konzipiert:
 *   - Fuehrt einmalig npm install + npm run build aus (OOM-sicher)
 *   - Startet Backend (NestJS, intern Port 4000) und
 *     Frontend (Next.js) als Child-Prozesse
 *   - Frontend nutzt die PORT-Umgebungsvariable des Hosters (z.B. 25558)
 *   - /api wird vom Frontend-Proxy an das Backend durchgereicht
 *   - Bei Absturz eines Teils: automatischer Restart nach 3s
 *
 * Start (Pterodactyl MAIN_FILE = index.js):
 *   node index.js
 */

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const ROOT = __dirname;
const BACKEND_DIR = path.join(ROOT, "backend");
const FRONTEND_DIR = path.join(ROOT, "frontend");

const ENV = { ...process.env, NODE_ENV: process.env.NODE_ENV || "production" };
if (!ENV.DATABASE_URL) {
  ENV.DATABASE_URL =
    "postgresql://postgres:postgres@localhost:5432/orionx?schema=public";
}

const children = [];
let shuttingDown = false;

function run(cmd, args, cwd, label) {
  return new Promise((resolve, reject) => {
    console.log(`[orionx] ${label}: ${cmd} ${args.join(" ")}`);
    const child = spawn(cmd, args, { cwd, env: ENV, stdio: "inherit" });
    child.on("error", (err) => reject(err));
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${label} exited with code ${code}`));
    });
  });
}

function startChild(name, cmd, args, cwd) {
  if (shuttingDown) return;
  const child = spawn(cmd, args, { cwd, env: ENV, stdio: "inherit" });
  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    console.error(
      `[orionx] ${name} exited (code=${code}, signal=${signal}). Restarting in 3s...`
    );
    setTimeout(() => startChild(name, cmd, args, cwd), 3000);
  });
  child.on("error", (err) =>
    console.error(`[orionx] ${name} failed to start:`, err.message)
  );
  console.log(`[orionx] ${name} started (pid=${child.pid})`);
  children.push(child);
  return child;
}

async function setup() {
  // Pterodactyls Daemon installiert im Root, loest aber die Workspaces im
  // Container oft nicht auf. Wir installieren + bauen daher pro Unterordner
  // direkt (kein --workspace), das ist robust und umgeht den Fehler
  // "No workspaces found".

  const workspaces = [
    { dir: BACKEND_DIR, name: "backend", build: true },
    { dir: FRONTEND_DIR, name: "frontend", build: true },
  ];

  for (const ws of workspaces) {
    console.log(`[orionx] Installing ${ws.name} dependencies...`);
    try {
      await run(
        "npm",
        ["install", "--no-audit", "--no-fund", "--maxsockets", "1"],
        ws.dir,
        `npm install ${ws.name}`
      );
    } catch (e) {
      console.error(`[orionx] npm install ${ws.name} failed:`, e.message);
      process.exit(1);
    }

    if (ws.build) {
      console.log(`[orionx] Building ${ws.name}...`);
      try {
        await run("npm", ["run", "build"], ws.dir, `${ws.name} build`);
      } catch (e) {
        console.error(`[orionx] ${ws.name} build failed:`, e.message);
        process.exit(1);
      }
    }
  }

  // 3) Build-Artefakte pruefen
  const backendMain = path.join(BACKEND_DIR, "dist", "main.js");
  const frontendNext = path.join(FRONTEND_DIR, ".next");
  if (!fs.existsSync(backendMain)) {
    console.error(`[orionx] Backend build missing: ${backendMain}`);
    process.exit(1);
  }
  if (!fs.existsSync(frontendNext)) {
    console.error(`[orionx] Frontend build missing: ${frontendNext}`);
    process.exit(1);
  }
}

async function main() {
  await setup();

  const hostPort = ENV.PORT || "25558";
  console.log(`[orionx] Starting ORION X -> Frontend on :${hostPort}, Backend on :4000`);

  // Backend: gebauter NestJS-Output (intern Port 4000)
  // nutzt npm run start aus backend/node_modules (robuster als rohes node)
  startChild("backend", "npm", ["run", "start"], BACKEND_DIR);

  // Frontend: produktiver Next.js-Server auf dem Hoster-Port
  startChild("frontend", "npm", ["run", "start", "--", "-p", String(hostPort)], FRONTEND_DIR);
}

function shutdown(signal) {
  shuttingDown = true;
  console.log(`[orionx] Received ${signal}, shutting down...`);
  children.forEach((c) => {
    try { c.kill(signal); } catch (_) {}
  });
  setTimeout(() => process.exit(0), 2000);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

main().catch((err) => {
  console.error("[orionx] Fatal:", err);
  process.exit(1);
});
