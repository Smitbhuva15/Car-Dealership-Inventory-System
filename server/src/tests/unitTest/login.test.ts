import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../../model/User";
import { login } from "../../services/login";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("login service", () => {
  const userId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();

    process.env.JWT_SECRET = "test-secret";
  });

  it("should login user successfully", async () => {
    jest.spyOn(User, "findOne").mockResolvedValue({
      _id: userId,
      name: "John",
      email: "john@example.com",
      password: "hashedPassword",
      role: "user",
    } as never);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

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
        name: "John",
        email: "john@example.com",
        role: "user",
      },
      token: "jwt-token",
    });
  });

 
});