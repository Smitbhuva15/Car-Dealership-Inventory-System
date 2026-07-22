import mongoose from "mongoose";
import { Vehicle } from "../model/Vehicle";

export const updateVehicle = async (id: string, updateData: any) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid vehicle ID.");
    }

    // Check if vehicle exists
    const existingVehicle = await Vehicle.findById(id);

    if (!existingVehicle) {
      throw new Error("Vehicle not found.");
    }

    // Update vehicle
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      {
        make: updateData.make,
        model: updateData.model,
        category: updateData.category,
        price: updateData.price,
        quantity: updateData.quantity,
      },
      { new: true }
    );

    return updatedVehicle;
  } catch (error: any) {
    throw new Error(error.message);
  }
};