import { FastifyInstance } from "fastify";
import { createTestApp, closeTestApp, getTestPrisma } from "../helpers/app";
import { faker } from "@faker-js/faker";

describe("Auth API", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createTestApp();
    await app.ready();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: "SecurePassword123!",
      };

      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/register",
        payload: userData,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty("accessToken");
      expect(body).toHaveProperty("refreshToken");
      expect(body.user).toHaveProperty("email", userData.email);
      expect(body.user).toHaveProperty("username", userData.username);
    });

    it("should reject registration with duplicate email", async () => {
      const email = faker.internet.email();
      const userData = {
        email,
        username: faker.internet.username(),
        password: "SecurePassword123!",
      };

      // First registration
      await app.inject({
        method: "POST",
        url: "/api/v1/auth/register",
        payload: userData,
      });

      // Duplicate registration
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/register",
        payload: {
          ...userData,
          username: faker.internet.username(), // Different username
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toBeDefined();
    });

    it("should reject weak passwords", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/register",
        payload: {
          email: faker.internet.email(),
          username: faker.internet.username(),
          password: "weak",
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    const testUser = {
      email: faker.internet.email(),
      username: faker.internet.username(),
      password: "SecurePassword123!",
    };

    beforeAll(async () => {
      // Create test user
      await app.inject({
        method: "POST",
        url: "/api/v1/auth/register",
        payload: testUser,
      });
    });

    it("should login with email successfully", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/login",
        payload: {
          emailOrUsername: testUser.email,
          password: testUser.password,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty("accessToken");
      expect(body).toHaveProperty("refreshToken");
    });

    it("should login with username successfully", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/login",
        payload: {
          emailOrUsername: testUser.username,
          password: testUser.password,
        },
      });

      expect(response.statusCode).toBe(200);
    });

    it("should reject login with wrong password", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/login",
        payload: {
          emailOrUsername: testUser.email,
          password: "WrongPassword123!",
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it("should reject login with non-existent user", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/login",
        payload: {
          emailOrUsername: "nonexistent@example.com",
          password: "SecurePassword123!",
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    let refreshToken: string;

    beforeAll(async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/register",
        payload: {
          email: faker.internet.email(),
          username: faker.internet.username(),
          password: "SecurePassword123!",
        },
      });

      const body = JSON.parse(response.body);
      refreshToken = body.refreshToken;
    });

    it("should refresh tokens successfully", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/refresh",
        payload: { refreshToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty("accessToken");
      expect(body).toHaveProperty("refreshToken");
      expect(body.refreshToken).not.toBe(refreshToken); // Should rotate
    });

    it("should reject invalid refresh token", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/refresh",
        payload: { refreshToken: "invalid-token" },
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
