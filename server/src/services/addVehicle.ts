import { IVehicle, Vehicle } from "../model/Vehicle";

export const addVehicle = async (vehicleData: any) => {

    const { make, model, category, price, quantity } = vehicleData;

   try {
    // Basic validation
    if (!make || typeof make !== 'string') {
      throw new Error('Make is required and must be a non-empty string.');
    }

    if (!model || typeof model !== 'string') {
      throw new Error('Model is required and must be a non-empty string.');
    }

    if (!category || typeof category !== 'string') {
      throw new Error('Category is required and must be a non-empty string.');
    }

     if (typeof price !== 'number' || price < 0) {
      throw new Error('Price must be a number and must be greater than or equal to 0.');
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error('Quantity must be a non-negative integer.');
    }

    // Create vehicle
    const vehicle = new Vehicle({
      make: make,
      model: model,
      category: category,
      price,
      quantity
    });

    const savedVehicle = await vehicle.save();
    return savedVehicle;

  } catch (error: any) {
    throw new Error(error.message);
  }
};