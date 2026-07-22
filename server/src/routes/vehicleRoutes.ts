import express from "express";
import  authenticate from "../middleware/authenticate";
import  authorize  from "../middleware/authorize"; 
import { addVehicleController,updateVehicleController } from "../controllers/vehicleController";

const vehicleRoutes = express.Router();

// Admin only routes
vehicleRoutes.post('/add', authenticate, authorize('admin'), addVehicleController);
vehicleRoutes.put('/update/:id', authenticate, authorize('admin'),updateVehicleController);

export default vehicleRoutes;