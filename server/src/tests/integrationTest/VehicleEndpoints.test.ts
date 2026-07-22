import request from "supertest";
import { app } from "../../app";
import {
    connect,
    clearDatabase,
    closeDatabase,
} from "../../test-utils/db-handler";
import { User } from "../../model/User";
import jwt from "jsonwebtoken";


beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret";
  await connect();
});                                            // Setup once before all tests
afterAll(async () => await closeDatabase());   // Cleanup after all tests
beforeEach(async () => await clearDatabase()); // Clean before each test


describe("Integration Tests - Vehicle Endpoints", () => {
  let token: string;

  beforeEach(async () => {
    // Create an admin user
    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "Password123",
      role: "admin",
    });

    // Generate JWT
    token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET!
    );
  });

  test("POST /api/vehicles/add - should create a vehicle", async () => {
    const res = await request(app)
      .post("/api/vehicles/add")
      .set("Cookie", [`token=${token}`])
      .send({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 4500000,
        quantity: 5,
      });

    expect(res.statusCode).toBe(201);

    expect(res.body).toEqual({
      message: "Vehicle created successfully.",
      data: expect.objectContaining({
        _id: expect.any(String),
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 4500000,
        quantity: 5,
      }),
    });
  });

  test("should return 400 when make is missing", async () => {
    const res = await request(app)
      .post("/api/vehicles/add")
      .set("Cookie", [`token=${token}`])
      .send({
        model: "Fortuner",
        category: "SUV",
        price: 4500000,
        quantity: 5,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe(
      "Make is required and must be a non-empty string."
    );
  });

  test("should return 401 when token is missing", async () => {
    const res = await request(app)
      .post("/api/vehicles/add")
      .send({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 4500000,
        quantity: 5,
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Authentication required.");
  });

  test("should return 401 for invalid token", async () => {
    const res = await request(app)
      .post("/api/vehicles/add")
      .set("Cookie", ["token=invalid-token"])
      .send({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 4500000,
        quantity: 5,
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid or expired token.");
  });
});