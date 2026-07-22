import express from "express";
import  authenticate from "../middleware/authenticate";
import  authorize  from "../middleware/authorize"; 
import { addVehicleController,deleteVehicleController,restockVehicleController,updateVehicleController } from "../controllers/vehicleController";

const vehicleRoutes = express.Router();

// Admin only routes
vehicleRoutes.post('/add', authenticate, authorize('admin'), addVehicleController);
vehicleRoutes.put('/update/:id', authenticate, authorize('admin'),updateVehicleController);
vehicleRoutes.delete('/delete/:id', authenticate, authorize('admin'), deleteVehicleController);
vehicleRoutes.post('/restock/:id', authenticate, authorize('admin'), restockVehicleController);

export default vehicleRoutes;