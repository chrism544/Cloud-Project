import { FastifyInstance } from "fastify";
import { createTestApp, closeTestApp, getTestPrisma } from "../helpers/app";
import { faker } from "@faker-js/faker";

describe("Portals API", () => {
  let app: FastifyInstance;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    app = await createTestApp();
    await app.ready();

    // Create and authenticate a test user
    const registerResponse = await app.inject({
      method: "POST",
      url: "/api/v1/auth/register",
      payload: {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: "SecurePassword123!",
      },
    });

    const registerBody = JSON.parse(registerResponse.body);
    authToken = registerBody.accessToken;
    userId = registerBody.user.id;
  });

  afterAll(async () => {
    await closeTestApp();
  });

  describe("POST /api/v1/portals", () => {
    it("should create a new portal successfully", async () => {
      const portalData = {
        name: faker.company.name(),
        subdomain: faker.internet.domainWord(),
        customDomain: faker.internet.domainName(),
      };

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/portals",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: portalData,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty("id");
      expect(body).toHaveProperty("name", portalData.name);
      expect(body).toHaveProperty("subdomain", portalData.subdomain);
      expect(body).toHaveProperty("customDomain", portalData.customDomain);
      expect(body).toHaveProperty("isActive", true);
    });

    it("should reject portal creation without authentication", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/portals",
        payload: {
          name: faker.company.name(),
          subdomain: faker.internet.domainWord(),
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it("should reject duplicate subdomain", async () => {
      const subdomain = faker.internet.domainWord();

      // Create first portal
      await app.inject({
        method: "POST",
        url: "/api/v1/portals",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          name: faker.company.name(),
          subdomain,
        },
      });

      // Try to create second portal with same subdomain
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/portals",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          name: faker.company.name(),
          subdomain,
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("GET /api/v1/portals", () => {
    beforeAll(async () => {
      // Create a few test portals
      for (let i = 0; i < 3; i++) {
        await app.inject({
          method: "POST",
          url: "/api/v1/portals",
          headers: {
            authorization: `Bearer ${authToken}`,
          },
          payload: {
            name: faker.company.name(),
            subdomain: faker.internet.domainWord() + i,
          },
        });
      }
    });

    it("should list all portals", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/v1/portals",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThanOrEqual(3);
    });

    it("should require authentication", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/v1/portals",
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("GET /api/v1/portals/:id", () => {
    let portalId: string;

    beforeAll(async () => {
      const createResponse = await app.inject({
        method: "POST",
        url: "/api/v1/portals",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          name: faker.company.name(),
          subdomain: faker.internet.domainWord(),
        },
      });

      const body = JSON.parse(createResponse.body);
      portalId = body.id;
    });

    it("should get portal by id", async () => {
      const response = await app.inject({
        method: "GET",
        url: `/api/v1/portals/${portalId}`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty("id", portalId);
    });

    it("should return 404 for non-existent portal", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/v1/portals/non-existent-id",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("PATCH /api/v1/portals/:id", () => {
    let portalId: string;

    beforeAll(async () => {
      const createResponse = await app.inject({
        method: "POST",
        url: "/api/v1/portals",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          name: faker.company.name(),
          subdomain: faker.internet.domainWord(),
        },
      });

      const body = JSON.parse(createResponse.body);
      portalId = body.id;
    });

    it("should update portal successfully", async () => {
      const newName = faker.company.name();
      const response = await app.inject({
        method: "PATCH",
        url: `/api/v1/portals/${portalId}`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          name: newName,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty("name", newName);
    });

    it("should toggle portal active status", async () => {
      const response = await app.inject({
        method: "PATCH",
        url: `/api/v1/portals/${portalId}`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          isActive: false,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty("isActive", false);
    });
  });

  describe("DELETE /api/v1/portals/:id", () => {
    let portalId: string;

    beforeEach(async () => {
      const createResponse = await app.inject({
        method: "POST",
        url: "/api/v1/portals",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          name: faker.company.name(),
          subdomain: faker.internet.domainWord() + Date.now(),
        },
      });

      const body = JSON.parse(createResponse.body);
      portalId = body.id;
    });

    it("should delete portal successfully", async () => {
      const response = await app.inject({
        method: "DELETE",
        url: `/api/v1/portals/${portalId}`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(204);

      // Verify portal is deleted
      const getResponse = await app.inject({
        method: "GET",
        url: `/api/v1/portals/${portalId}`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(getResponse.statusCode).toBe(404);
    });
  });
});
