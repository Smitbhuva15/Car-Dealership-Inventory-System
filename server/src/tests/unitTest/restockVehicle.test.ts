import mongoose from "mongoose";
import { Vehicle } from "../../model/Vehicle";
import { restockVehicle } from "../../services/restockVehicle";

describe("restockVehicle service", () => {
    const vehicleId = new mongoose.Types.ObjectId().toString();

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should restock vehicle successfully", async () => {
        const saveMock = jest.fn().mockResolvedValue({
            _id: vehicleId,
            make: "Toyota",
            quantity: 15,
        });

        const vehicle = {
            _id: vehicleId,
            make: "Toyota",
            quantity: 10,
            save: saveMock,
        };

        jest.spyOn(Vehicle, "findById").mockResolvedValue(vehicle as never);

        const result = await restockVehicle(vehicleId, 5);

        expect(Vehicle.findById).toHaveBeenCalledWith(vehicleId);
        expect(vehicle.quantity).toBe(15);
        expect(saveMock).toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            message: "Vehicle restocked successfully.",
            vehicle: {
                _id: vehicleId,
                make: "Toyota",
                quantity: 15,
            },
        });
    });

    it("should throw error for invalid ObjectId", async () => {
        const findByIdSpy = jest.spyOn(Vehicle, "findById");

        await expect(
            restockVehicle("invalid-id", 5)
        ).rejects.toThrow("Invalid vehicle ID.");

        expect(findByIdSpy).not.toHaveBeenCalled();
    });

    it("should throw error when quantity is zero", async () => {
        const findByIdSpy = jest.spyOn(Vehicle, "findById");

        await expect(
            restockVehicle(vehicleId, 0)
        ).rejects.toThrow("Quantity must be a positive integer.");

        expect(findByIdSpy).not.toHaveBeenCalled();
    });

    it("should throw error when quantity is negative", async () => {
        const findByIdSpy = jest.spyOn(Vehicle, "findById");

        await expect(
            restockVehicle(vehicleId, -5)
        ).rejects.toThrow("Quantity must be a positive integer.");

        expect(findByIdSpy).not.toHaveBeenCalled();
    });

    it("should throw error when quantity is decimal", async () => {
        const findByIdSpy = jest.spyOn(Vehicle, "findById");

        await expect(
            restockVehicle(vehicleId, 2.5)
        ).rejects.toThrow("Quantity must be a positive integer.");

        expect(findByIdSpy).not.toHaveBeenCalled();
    });

    it("should throw error when vehicle does not exist", async () => {
        jest.spyOn(Vehicle, "findById").mockResolvedValue(null as never);

        await expect(
            restockVehicle(vehicleId, 5)
        ).rejects.toThrow("Vehicle not found.");

        expect(Vehicle.findById).toHaveBeenCalledWith(vehicleId);
    });

    it("should throw database error when save fails", async () => {
        const vehicle = {
            _id: vehicleId,
            quantity: 10,
            save: jest.fn().mockRejectedValue(new Error("Database error")),
        };

        jest.spyOn(Vehicle, "findById").mockResolvedValue(vehicle as never);

        await expect(
            restockVehicle(vehicleId, 5)
        ).rejects.toThrow("Database error");

        expect(vehicle.save).toHaveBeenCalledTimes(1);
    });

});