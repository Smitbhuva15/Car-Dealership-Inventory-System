import express from "express";
import {
  loginController,
  registerController,
} from "../controllers/authController";

const authRoutes = express.Router();

// Register a new user
authRoutes.post("/register", registerController);

// Authenticate user and log in
authRoutes.post("/login", loginController);

export default authRoutes;