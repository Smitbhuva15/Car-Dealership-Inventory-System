import mongoose from "mongoose";
import { Vehicle } from "../model/Vehicle";

export const restockVehicle = async (id: string, quantity: number) => {
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

    // Update quantity (increase)
    vehicle.quantity = vehicle.quantity + quantity;
    const updatedVehicle = await vehicle.save();

    return {
      message: 'Vehicle restocked successfully.',
      vehicle: updatedVehicle
    };

  } catch (error: any) {
    throw new Error(error.message);
  }
};