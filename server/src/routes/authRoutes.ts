import express from 'express';
import { registerController } from '../controllers/authController';


const authRoutes = express.Router();

authRoutes.post('/register', registerController);

export default authRoutes;