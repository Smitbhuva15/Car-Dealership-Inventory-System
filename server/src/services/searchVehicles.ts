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
        const parsedMinPrice = Number(minPrice);

        if (isNaN(parsedMinPrice)) {
          throw new Error("Min price must be a valid number.");
        }

        query.price.$gte = parsedMinPrice;
      }

      if (maxPrice !== undefined) {
        const parsedMaxPrice = Number(maxPrice);

        if (isNaN(parsedMaxPrice)) {
          throw new Error("Max price must be a valid number.");
        }

        query.price.$lte = parsedMaxPrice;
      }
    }

    return await Vehicle.find(query);
  } catch (error: any) {
    throw new Error(error.message);
  }
};