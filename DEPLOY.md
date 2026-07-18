# ORION X – Deployment auf eigenem VPS/Server

Ziel: App soll unter **http://77.90.30.250:25558** erreichbar sein.
Ein Port = ein Listener. Daher verteilt ein nginx-Reverse-Proxy Port 25558:
- `/`     → Next.js Frontend (intern Port 3000)
- `/api`  → NestJS Backend (intern Port 4000)

---

## 1. Dateien für den Hoster

Vollständiger Projektordner `ORION X` (Git-Repo oder ZIP), **ohne** `node_modules`, `.next`, `backend/dist`, `backend/uploads`:

- `package.json`, `package-lock.json`
- `.env` (mit Produktionswerten – siehe unten)
- `frontend/` (komplett)
- `backend/` (komplett, inkl. `prisma/schema.prisma` + `prisma/migrations/`)
- `ai-core/` (falls genutzt)
- `scripts/deploy.sh`, `scripts/start.sh`
- `scripts/orionx-backend.service`, `scripts/orionx-frontend.service`
- `nginx-orionx.conf`

## 2. Server-Voraussetzungen (Hoster installiert)

- Ubuntu/Debian (systemd)
- Node.js ≥ 20, npm ≥ 10
- PostgreSQL ≥ 15 (lokal auf dem VPS)
- nginx

## 3. `.env` anpassen (Produktion)

```
DATABASE_URL="postgresql://<dbuser>:<dbpass>@localhost:5432/orionx?schema=public"
JWT_SECRET="<mind. 32 zufaellige Zeichen>"
NEXT_PUBLIC_API_URL=http://77.90.30.250:25558/api
NEXT_PUBLIC_APP_URL=http://77.90.30.250:25558
NEXTAUTH_URL=http://77.90.30.250:25558
NEXTAUTH_SECRET="<zufaellig>"
PORT=4000
NODE_ENV=production
```

Erstelle die Datenbank und den User auf dem VPS:
```bash
sudo -u postgres psql -c "CREATE USER orionx WITH PASSWORD 'dbpass';"
sudo -u postgres psql -c "CREATE DATABASE orionx OWNER orionx;"
```

## 4. Automatischer Start (keine manuellen Befehle nötig)

Ein einziger Befehl richtet alles ein (install, migrate, seed, build, systemd):

```bash
sudo bash scripts/deploy.sh
```

Danach:
- Backend + Frontend starten **automatisch bei jedem Server-Reboot**
- Bei Absturz startet systemd sie **automatisch neu** (`Restart=always`)

## 5. nginx einrichten (einmalig)

```bash
sudo cp nginx-orionx.conf /etc/nginx/sites-available/orionx
sudo ln -s /etc/nginx/sites-available/orionx /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 6. Prüfen

```bash
curl http://77.90.30.250:25558/api/health
# erwartet: {"status":"ok"} o.ä.
```

## 7. Logs / Steuerung

```bash
sudo journalctl -u orionx-backend -f
sudo journalctl -u orionx-frontend -f
sudo systemctl restart orionx-backend orionx-frontend
```

## 8. Ohne systemd (z. B. Container/SSH-Session)

```bash
bash scripts/start.sh
```
