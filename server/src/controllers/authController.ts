import { Request, Response } from "express";
import { register } from "../services/register";
import { login } from "../services/login";

export const registerController = async (
  req: Request,
  res: Response
) => {
  try {
    const { user } = await register(req.body);

    return res.status(201).json({
      message: "User registered successfully.",
      user,
    });
  } catch (error: any) {
    if (
      error.message.includes("required") ||
      error.message.includes("registered")
    ) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal Server Error.",
    });
  }
};

export const loginController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await login(req.body);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    });

    return res.status(200).json({
      message: "Login successful.",
      user: result.user,
    });
  } catch (error: any) {
    console.log (error);
    if (
      error.message.includes("required") ||
      error.message.includes("Invalid email or password")
    ) {
      return res.status(401).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal Server Error.",
    });
  }
};
