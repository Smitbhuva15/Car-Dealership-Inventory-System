import mongoose from "mongoose";
import { Vehicle } from "../model/Vehicle";

export const purchaseVehicle = async (id: string, quantity: number) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid vehicle ID.');
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Quantity must be a positive integer.');
    }

    // Check if vehicle exists
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      throw new Error('Vehicle not found.');
    }

    // Check if stock is sufficient
    if (vehicle.quantity < quantity) {
      throw new Error(`Insufficient stock. Available: ${vehicle.quantity}, Requested: ${quantity}`);
    }

    // Update quantity (decrease)
    vehicle.quantity = vehicle.quantity - quantity;
    const updatedVehicle = await vehicle.save();

    return {
      message: 'Vehicle purchased successfully.',
      vehicle: updatedVehicle
    };

  } catch (error: any) {
    throw new Error(error.message);
  }
};