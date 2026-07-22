import { Vehicle } from "../model/Vehicle";

export const deleteVehicle = async (id: string) => {
  try {
    await Vehicle.findById(id);

    await Vehicle.findByIdAndDelete(id);

    return {
      message: "Vehicle deleted successfully.",
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};