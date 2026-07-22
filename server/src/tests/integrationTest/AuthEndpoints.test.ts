import request from "supertest";
import { app } from "../../app";
import {
  connect,
  clearDatabase,
  closeDatabase,
} from "../../test-utils/db-handler";


beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret";
  await connect();
});                                            // Setup once before all tests
afterAll(async () => await closeDatabase());   // Cleanup after all tests
beforeEach(async () => await clearDatabase()); // Clean before each test

describe("Integration Tests - Register Endpoints", () => {
  test("POST /api/auth/register - should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "smit bhuva",
        email: "smit@example.com",
        password: "Password123",
      });

    expect(res.statusCode).toBe(201);

    expect(res.body).toEqual({
      message: "User registered successfully.",
      user: {
        id: expect.any(String),
        name: "smit bhuva",
        email: "smit@example.com",
        role: "user",
      },
    });
  });

  test("POST /api/auth/register - should fail when name is missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "smit@example.com",
        password: "Password123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe(
      "Name is required and must be a non-empty string."
    );
  });

  test("POST /api/auth/register - should fail when email is missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "smit bhuva",
        password: "Password123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe(
      "Email is required and must be a non-empty string."
    );
  });

  test("POST /api/auth/register - should fail when password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "smit bhuva",
        email: "smit@example.com",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe(
      "Password is required and must be at least 6 characters."
    );
  });

  test("POST /api/auth/register - should fail when password is less than 6 characters", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "smit bhuva",
        email: "smit@example.com",
        password: "123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe(
      "Password is required and must be at least 6 characters."
    );
  });

  test("POST /api/auth/register - should fail when email already registered", async () => {
    const user = {
      name: "smit bhuva",
      email: "smit@example.com",
      password: "Password123",
    };

    await request(app).post("/api/auth/register").send(user);

    const res = await request(app)
      .post("/api/auth/register")
      .send(user);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Email already registered.");
  });
});

describe("Integration Tests - Login Endpoint", () => {
  beforeEach(async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "smit bhuva",
        email: "smit@example.com",
        password: "Password123",
      });
  });

  test("POST /api/auth/login - should login successfully", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "smit@example.com",
        password: "Password123",
      });

    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual({
      message: "Login successful.",
      user: {
        id: expect.any(String),
        name: "smit bhuva",
        email: "smit@example.com",
        role: "user",
      },
    });

    // Verify cookie is set
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.headers["set-cookie"][0]).toContain("token=");
    expect(res.headers["set-cookie"][0]).toContain("HttpOnly");
  });

  test("POST /api/auth/login - should fail when email is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        password: "Password123",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Email is required.");
  });

  test("POST /api/auth/login - should fail when password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "smit@example.com",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Password is required.");
  });

  test("POST /api/auth/login - should fail with invalid email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "wrong@example.com",
        password: "Password123",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid email or password.");
  });

  test("POST /api/auth/login - should fail with incorrect password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "smit@example.com",
        password: "WrongPassword",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid email or password.");
  });
});