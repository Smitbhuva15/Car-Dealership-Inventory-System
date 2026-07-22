import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../../model/User";
import { login } from "../../services/login";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("login service", () => {
  const userId = new mongoose.Types.ObjectId();

  const mockUser = {
    _id: userId,
    name: "John Doe",
    email: "john@example.com",
    password: "hashedPassword",
    role: "user",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("should login successfully", async () => {
    jest.spyOn(User, "findOne").mockResolvedValue(mockUser as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    (jwt.sign as jest.Mock).mockReturnValue("mock-token");

    const result = await login({
      email: "john@example.com",
      password: "password123",
    });

    expect(User.findOne).toHaveBeenCalledWith({
      email: "john@example.com",
    });

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashedPassword"
    );

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: userId.toString(),
        email: "john@example.com",
        role: "user",
      },
      "test-secret",
      {
        expiresIn: "1d",
      }
    );

    expect(result).toEqual({
      user: {
        id: userId,
        name: "John Doe",
        email: "john@example.com",
        role: "user",
      },
      token: "mock-token",
    });
  });

  it("should throw error if email is missing", async () => {
    await expect(
      login({
        password: "password123",
      })
    ).rejects.toThrow("Email is required.");
  });

  it("should throw error if email is not a string", async () => {
    await expect(
      login({
        email: 123,
        password: "password123",
      })
    ).rejects.toThrow("Email is required.");
  });

  it("should throw error if password is missing", async () => {
    await expect(
      login({
        email: "john@example.com",
      })
    ).rejects.toThrow("Password is required.");
  });

  it("should throw error if password is not a string", async () => {
    await expect(
      login({
        email: "john@example.com",
        password: 123,
      })
    ).rejects.toThrow("Password is required.");
  });

  it("should throw error if user does not exist", async () => {
    jest.spyOn(User, "findOne").mockResolvedValue(null);

    await expect(
      login({
        email: "john@example.com",
        password: "password123",
      })
    ).rejects.toThrow("Invalid email or password.");
  });

  it("should throw error if password is incorrect", async () => {
    jest.spyOn(User, "findOne").mockResolvedValue(mockUser as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      login({
        email: "john@example.com",
        password: "wrongPassword",
      })
    ).rejects.toThrow("Invalid email or password.");

  });

  it("should throw error when User.findOne rejects", async () => {
    jest
      .spyOn(User, "findOne")
      .mockRejectedValue(new Error("Database error"));

    await expect(
      login({
        email: "john@example.com",
        password: "password123",
      })
    ).rejects.toThrow("Database error");
  });
 
});