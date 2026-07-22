import { User } from "../model/User";
import bcrypt from "bcrypt";

export const register = async (userData: any) => {
    const { name, email, password } = userData;

    try {
        // Validate name
        if (!name || typeof name !== "string") {
            throw new Error("Name is required and must be a non-empty string.");
        }

        // Validate email
        if (!email || typeof email !== "string") {
            throw new Error("Email is required and must be a non-empty string.");
        }

        // Validate password
        if (
            !password ||
            typeof password !== "string" ||
            password.length < 6
        ) {
            throw new Error(
                "Password is required and must be at least 6 characters."
            );
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("Email already registered.");
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        const savedUser = await user.save();

        return {
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
            }
        };
    } catch (error: any) {
        throw new Error(error.message);
    }
};