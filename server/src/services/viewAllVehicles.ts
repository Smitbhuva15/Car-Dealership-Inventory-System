import { Vehicle } from "../model/Vehicle";

export const viewAllVehicles = async () => {
  try {
    const vehicles = await Vehicle.find();
    return vehicles;
  } catch (error: any) {
    throw new Error('Failed to fetch vehicles.');
  }
};