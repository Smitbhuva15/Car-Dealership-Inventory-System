import { Vehicle } from "../model/Vehicle";

export const searchVehicles = async (filters: any) => {
  try {
    const { make, model, category, minPrice, maxPrice } = filters;

    const query: any = {};

    if (make) {
      query.make = { $regex: make, $options: "i" };
    }

    if (model) {
      query.model = { $regex: model, $options: "i" };
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};

      if (minPrice !== undefined) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        query.price.$lte = Number(maxPrice);
      }
    }

    return await Vehicle.find(query);
  } catch (error: any) {
    throw new Error(error.message);
  }
};