import express from "express";
import  authenticate from "../middleware/authenticate";
import  authorize  from "../middleware/authorize"; 
import { addVehicleController } from "../controllers/vehicleController";

const vehicleRoutes = express.Router();

// Admin only routes
vehicleRoutes.post('/add', authenticate, authorize('admin'), addVehicleController);

export default vehicleRoutes;