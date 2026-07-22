import { IVehicle, Vehicle } from "../model/Vehicle";

export const addVehicle = async (vehicleData: IVehicle) => {
  const vehicle = new Vehicle(vehicleData);
  return await vehicle.save();
};