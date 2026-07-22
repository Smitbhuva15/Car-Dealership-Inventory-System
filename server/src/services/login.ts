import { User } from "../model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (loginData: any) => {
  const { email, password } = loginData;

  try {
    if (!email || typeof email !== "string") {
      throw new Error("Email is required.");
    }

    if (!password || typeof password !== "string") {
      throw new Error("Password is required.");
    }

    const user: any = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};