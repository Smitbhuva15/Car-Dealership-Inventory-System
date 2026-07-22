import { Vehicle } from "../model/Vehicle";

export const restockVehicle = async (id: string, quantity: number) => {
  try {
    const vehicle: any = await Vehicle.findById(id);

    vehicle.quantity += quantity;

    const updatedVehicle = await vehicle.save();

    return {
      message: "Vehicle restocked successfully.",
      vehicle: updatedVehicle,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};