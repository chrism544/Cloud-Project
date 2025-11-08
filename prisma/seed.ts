import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create master theme
  const masterTheme = await prisma.assetContainer.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Master Theme",
      description: "Base theme for inheritance",
      colorPrimary: "#1F2937",
      colorSecondary: "#10B981",
    },
  });

  // Create a test portal
  const portal = await prisma.portal.upsert({
    where: { subdomain: "test" },
    update: {},
    create: {
      name: "Test Portal",
      subdomain: "test",
      assetContainerId: masterTheme.id,
    },
  });

  // Create admin user
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash,
      portalId: portal.id,
      role: "admin",
      emailVerified: true,
    },
  });

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
