import express from "express";
import  authenticate from "../middleware/authenticate";
import  authorize  from "../middleware/authorize"; 
import { addVehicleController,deleteVehicleController,purchaseVehicleController,restockVehicleController,searchVehicleController,updateVehicleController, viewAllVehiclesController } from "../controllers/vehicleController";

const vehicleRoutes = express.Router();

// Public routes (authentication required)
vehicleRoutes.get('/view-all', authenticate, viewAllVehiclesController);
vehicleRoutes.get('/search', authenticate, searchVehicleController);
vehicleRoutes.post('/purchase/:id', authenticate, purchaseVehicleController);

// Admin only routes
vehicleRoutes.post('/add', authenticate, authorize('admin'), addVehicleController);
vehicleRoutes.put('/update/:id', authenticate, authorize('admin'),updateVehicleController);
vehicleRoutes.delete('/delete/:id', authenticate, authorize('admin'), deleteVehicleController);
vehicleRoutes.post('/restock/:id', authenticate, authorize('admin'), restockVehicleController);

export default vehicleRoutes;