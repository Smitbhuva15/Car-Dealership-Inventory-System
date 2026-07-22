import { Vehicle } from "../model/Vehicle";

export const searchVehicles = async (filters: any) => {
  try {
    return await Vehicle.find(filters);
  } catch (error: any) {
    throw new Error(error.message);
  }
};