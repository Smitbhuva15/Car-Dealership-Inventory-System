import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../../model/User";
import { register } from "../../services/register";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("register service", () => {
    const userId = new mongoose.Types.ObjectId();

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();

        process.env.JWT_SECRET = "test-secret";
    });

    it("should register user successfully", async () => {
        jest.spyOn(User, "findOne").mockResolvedValue(null as never);

        (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
        (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

        jest.spyOn(User.prototype, "save").mockResolvedValue({
            _id: userId,
            name: "John",
            email: "john@example.com",
            password: "hashedPassword",
            role: "user",
        } as never);

        (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

        const result = await register({
            name: "John",
            email: "john@example.com",
            password: "password123",
        });

        expect(User.findOne).toHaveBeenCalledWith({
            email: "john@example.com",
        });

        expect(bcrypt.genSalt).toHaveBeenCalledWith(10);

        expect(bcrypt.hash).toHaveBeenCalledWith(
            "password123",
            "salt"
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
                _id: userId,
                name: "John",
                email: "john@example.com",
                password: "hashedPassword",
                role: "user",
            },
            token: "jwt-token",
        });
    });

    it("should throw when name is missing", async () => {
        await expect(
            register({
                email: "john@example.com",
                password: "password123",
            })
        ).rejects.toThrow(
            "Name is required and must be a non-empty string."
        );
    });

    it("should throw when name is not a string", async () => {

        await expect(
            register({
                name: 123,
                email: "john@example.com",
                password: "password123",
            })
        ).rejects.toThrow(
            "Name is required and must be a non-empty string."
        );
    });

    it("should throw when email is missing", async () => {
        await expect(
            register({
                name: "John",
                password: "password123",
            })
        ).rejects.toThrow(
            "Email is required and must be a non-empty string."
        );
    });

    it("should throw when email is not a string", async () => {
        await expect(
            register({
                name: "John",
                email: 123,
                password: "password123",
            })
        ).rejects.toThrow(
            "Email is required and must be a non-empty string."
        );
    });

    it("should throw when password is missing", async () => {
        await expect(
            register({
                name: "John",
                email: "john@example.com",
            })
        ).rejects.toThrow(
            "Password is required and must be at least 6 characters."
        );
    });

    it("should throw when password is less than 6 characters", async () => {
        await expect(
            register({
                name: "John",
                email: "john@example.com",
                password: "12345",
            })
        ).rejects.toThrow(
            "Password is required and must be at least 6 characters."
        );
    });

    it("should throw when email already exists", async () => {
        jest.spyOn(User, "findOne").mockResolvedValue({} as never);

        await expect(
            register({
                name: "John",
                email: "john@example.com",
                password: "password123",
            })
        ).rejects.toThrow("Email already registered.");
    });

    it("should throw when bcrypt.genSalt fails", async () => {
        jest.spyOn(User, "findOne").mockResolvedValue(null as never);

        (bcrypt.genSalt as jest.Mock).mockRejectedValue(
            new Error("Salt error")
        );

        await expect(
            register({
                name: "John",
                email: "john@example.com",
                password: "password123",
            })
        ).rejects.toThrow("Salt error");
    });

    it("should throw when bcrypt.hash fails", async () => {
        jest.spyOn(User, "findOne").mockResolvedValue(null as never);

        (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
        (bcrypt.hash as jest.Mock).mockRejectedValue(
            new Error("Hash error")
        );

        await expect(
            register({
                name: "John",
                email: "john@example.com",
                password: "password123",
            })
        ).rejects.toThrow("Hash error");
    });

});