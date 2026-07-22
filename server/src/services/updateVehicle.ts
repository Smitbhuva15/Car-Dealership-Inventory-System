import mongoose from "mongoose";
import { Vehicle } from "../model/Vehicle";

export const updateVehicle = async (id: string, updateData: any) => {
  const { make, model, category, price, quantity } = updateData;

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid vehicle ID.');
    }

    // Check if vehicle exists
    const existingVehicle = await Vehicle.findById(id);
    if (!existingVehicle) {
      throw new Error('Vehicle not found.');
    }

    // Build update object with only provided fields
    const updateFields: any = {};
    if (make !== undefined) {
      if (typeof make !== 'string') {
        throw new Error('Make must be a non-empty string.');
      }
      updateFields.make = make;
    }

    if (model !== undefined) {
      if (typeof model !== 'string') {
        throw new Error('Model must be a non-empty string.');
      }
      updateFields.model = model;
    }

    if (category !== undefined) {
      if (typeof category !== 'string') {
        throw new Error('Category must be a non-empty string.');
      }
      updateFields.category = category;
    }

    if (price !== undefined) {
      if (typeof price !== 'number' || price < 0) {
        throw new Error('Price must be a number and must be greater than or equal to 0.');
      }
      updateFields.price = price;
    }

    if (quantity !== undefined) {
      if (!Number.isInteger(quantity) || quantity < 0) {
        throw new Error('Quantity must be a non-negative integer.');
      }
      updateFields.quantity = quantity;
    }

    // Update vehicle
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    return updatedVehicle;

  } catch (error: any) {
  
    throw new Error(error.message);
  }
};