import mongoose from "mongoose";
import { Vehicle } from "../model/Vehicle";

export const deleteVehicle = async (id: string) => {
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

        // Delete vehicle
        await Vehicle.findByIdAndDelete(id);
        return { message: 'Vehicle deleted successfully.' };

    } catch (error: any) {
        throw new Error(error.message);
    }
};