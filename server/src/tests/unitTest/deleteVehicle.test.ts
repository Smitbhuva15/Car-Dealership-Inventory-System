import mongoose from "mongoose";
import { Vehicle } from "../../model/Vehicle";
import { deleteVehicle } from "../../services/deleteVehicle";

describe("deleteVehicle service", () => {
    const vehicleId = new mongoose.Types.ObjectId().toString();

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should delete vehicle successfully", async () => {
        jest.spyOn(Vehicle, "findById").mockResolvedValue({ _id: vehicleId } as never);

        jest
            .spyOn(Vehicle, "findByIdAndDelete")
            .mockResolvedValue({ _id: vehicleId } as never);

        const result = await deleteVehicle(vehicleId);

        expect(Vehicle.findById).toHaveBeenCalledWith(vehicleId);

        expect(Vehicle.findByIdAndDelete).toHaveBeenCalledWith(vehicleId);

        expect(result).toEqual({
            message: "Vehicle deleted successfully.",
        });
    });

    it("should throw error for invalid ObjectId", async () => {
        const findByIdSpy = jest.spyOn(Vehicle, "findById");

        await expect(deleteVehicle("invalid-id")).rejects.toThrow(
            "Invalid vehicle ID."
        );

        expect(findByIdSpy).not.toHaveBeenCalled();
    });

    it("should throw error when vehicle does not exist", async () => {
        jest.spyOn(Vehicle, "findById").mockResolvedValue(null as never);

        jest
            .spyOn(Vehicle, "findByIdAndDelete")
            .mockResolvedValue(null as never);

        await expect(deleteVehicle(vehicleId)).rejects.toThrow(
            "Vehicle not found."
        );

        expect(Vehicle.findById).toHaveBeenCalledWith(vehicleId);
        expect(Vehicle.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it("should throw database error when findById fails", async () => {
        jest
            .spyOn(Vehicle, "findById")
            .mockRejectedValue(new Error("Database error"));

        await expect(deleteVehicle(vehicleId)).rejects.toThrow(
            "Database error"
        );

        expect(Vehicle.findById).toHaveBeenCalledWith(vehicleId);
    });

    it("should throw database error when findByIdAndDelete fails", async () => {
        jest.spyOn(Vehicle, "findById").mockResolvedValue({ _id: vehicleId } as never);

        jest
            .spyOn(Vehicle, "findByIdAndDelete")
            .mockRejectedValue(new Error("Database error"));

        await expect(deleteVehicle(vehicleId)).rejects.toThrow(
            "Database error"
        );

        expect(Vehicle.findById).toHaveBeenCalledWith(vehicleId);
        expect(Vehicle.findByIdAndDelete).toHaveBeenCalledWith(vehicleId);
    });

});