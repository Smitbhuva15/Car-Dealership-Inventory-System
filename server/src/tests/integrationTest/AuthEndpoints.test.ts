import request from "supertest";
import {app} from "../../app";
import {
  connect,
  clearDatabase,
  closeDatabase,
} from "../../test-utils/db-handler";


beforeAll(async () => await connect());        // Setup once before all tests
afterAll(async () => await closeDatabase());   // Cleanup after all tests
beforeEach(async () => await clearDatabase()); // Clean before each test

describe("Integration Tests - Auth Endpoints", () => {
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
        name: "John Doe",
        email: "john@example.com",
        password: "123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe(
      "Password is required and must be at least 6 characters."
    );
  });

  test("POST /api/auth/register - should fail when email already registered", async () => {
    const user = {
      name: "John Doe",
      email: "john@example.com",
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

