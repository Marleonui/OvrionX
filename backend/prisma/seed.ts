import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@orionx.com" },
    update: {},
    create: {
      email: "admin@orionx.com",
      passwordHash,
      displayName: "ORION Admin",
      role: "ADMIN",
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@orionx.com" },
    update: {},
    create: {
      email: "owner@orionx.com",
      passwordHash: await bcrypt.hash("OrionOwner2026!", 10),
      displayName: "ORION Owner",
      role: "ADMIN",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@orionx.com" },
    update: {},
    create: {
      email: "user@orionx.com",
      passwordHash: await bcrypt.hash("User123!", 10),
      displayName: "Max Mustermann",
      role: "USER",
    },
  });

  const project = await prisma.project.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "ORION X Launch",
      description: "Initiales Pilotprojekt für das ORION X Betriebssystem.",
      status: "ACTIVE",
      ownerId: owner.id,
      teamIds: JSON.stringify([owner.id, admin.id, user.id]),
      startDate: new Date(),
    },
  });

  const taskTitles = [
    { title: "Architektur festlegen", status: "DONE", priority: "HIGH" },
    { title: "Auth-Flow implementieren", status: "IN_PROGRESS", priority: "CRITICAL" },
    { title: "Dashboard UI bauen", status: "TODO", priority: "MEDIUM" },
    { title: "API-Doku schreiben", status: "BACKLOG", priority: "LOW" },
    { title: "Beta-Review", status: "REVIEW", priority: "HIGH" },
  ];

  for (let i = 0; i < taskTitles.length; i++) {
    const t = taskTitles[i];
    await prisma.task.upsert({
      where: { id: `00000000-0000-0000-0000-0000000000${i + 1}` },
      update: {},
      create: {
        id: `00000000-0000-0000-0000-0000000000${i + 1}`,
        projectId: project.id,
        assigneeId: i % 3 === 0 ? owner.id : i % 3 === 1 ? admin.id : user.id,
        title: t.title,
        status: t.status as any,
        priority: t.priority as any,
        order: i,
      },
    });
  }

  console.log("Seed abgeschlossen:");
  console.log(`  Owner:  owner@orionx.com / OrionOwner2026!`);
  console.log(`  Admin:  admin@orionx.com / Admin123!`);
  console.log(`  User:   user@orionx.com  / User123!`);
  console.log(`  Project: ${project.name} (Owner: ${owner.displayName}, ${taskTitles.length} Tasks)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
