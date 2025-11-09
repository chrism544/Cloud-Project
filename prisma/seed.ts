import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create master asset container (legacy theming)
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

  // Create User Portal
  const userPortal = await prisma.portal.upsert({
    where: { subdomain: "user" },
    update: {},
    create: {
      name: "User Portal",
      subdomain: "user",
      assetContainerId: masterTheme.id,
    },
  });

  // Create Admin Portal
  const adminPortal = await prisma.portal.upsert({
    where: { subdomain: "admin" },
    update: {},
    create: {
      name: "Admin Portal",
      subdomain: "admin",
      assetContainerId: masterTheme.id,
    },
  });

  // Create admin user
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash,
      portalId: adminPortal.id,
      role: "admin",
      emailVerified: true,
    },
  });

  // Create Super Admin
  const superPassword = await bcrypt.hash("Superman@1", 12);
  const superUser = await prisma.user.upsert({
    where: { email: "Chris.Malbon" },
    update: { passwordHash: superPassword, role: "superadmin", portalId: adminPortal.id },
    create: {
      email: "Chris.Malbon",
      passwordHash: superPassword,
      portalId: adminPortal.id,
      role: "superadmin",
      emailVerified: true,
    },
  });

  // Create default Themes per portal (new Theme model)
  const defaultTokens = {
    colors: {
      primary: "#1F2937",
      secondary: "#10B981",
      accent: "#6366F1",
      background: "#FFFFFF",
      text: "#111827",
    },
    typography: {
      fontFamily: "Inter, ui-sans-serif, system-ui",
      headingSizes: { h1: "2.25rem", h2: "1.875rem", h3: "1.5rem", h4: "1.25rem", h5: "1.125rem", h6: "1rem" },
      bodySize: "1rem",
      lineHeight: { tight: "1.25", normal: "1.5", relaxed: "1.75" },
    },
    spacing: { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "3rem" },
    borderRadius: { none: "0px", sm: "0.125rem", md: "0.375rem", lg: "0.5rem", full: "9999px" },
    shadows: { sm: "0 1px 2px rgba(0,0,0,0.05)", md: "0 4px 6px rgba(0,0,0,0.1)", lg: "0 10px 15px rgba(0,0,0,0.15)", xl: "0 20px 25px rgba(0,0,0,0.2)" },
  } as const;

  await prisma.theme.upsert({
    where: { id: "00000000-0000-0000-0000-0000000000A1" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-0000000000A1",
      name: "Default Theme",
      portalId: adminPortal.id,
      isActive: true,
      tokens: defaultTokens as any,
    },
  });

  await prisma.theme.upsert({
    where: { id: "00000000-0000-0000-0000-0000000000B1" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-0000000000B1",
      name: "Default Theme",
      portalId: userPortal.id,
      isActive: true,
      tokens: defaultTokens as any,
    },
  });

  // Assign portal roles (UserOnPortal)
  await prisma.userOnPortal.upsert({
    where: { userId_portalId: { userId: adminUser.id, portalId: adminPortal.id } },
    update: {},
    create: {
      userId: adminUser.id,
      portalId: adminPortal.id,
      assignedRole: UserRole.PORTAL_ADMIN,
      isActive: true,
    },
  });

  await prisma.userOnPortal.upsert({
    where: { userId_portalId: { userId: superUser.id, portalId: adminPortal.id } },
    update: {},
    create: {
      userId: superUser.id,
      portalId: adminPortal.id,
      assignedRole: UserRole.SUPER_ADMIN,
      isActive: true,
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
