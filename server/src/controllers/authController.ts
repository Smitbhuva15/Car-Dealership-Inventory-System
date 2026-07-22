import { Request, Response } from "express";
import { register } from "../services/register";

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