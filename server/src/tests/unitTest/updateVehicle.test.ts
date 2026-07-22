import mongoose from "mongoose";
import { Vehicle } from "../../model/Vehicle";
import { updateVehicle } from "../../services/updateVehicle";

describe("updateVehicle service", () => {
    const vehicleId = new mongoose.Types.ObjectId().toString();

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should update vehicle successfully with all fields", async () => {
        const updatedVehicle = {
            _id: vehicleId,
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 5000000,
            quantity: 5,
        };

        jest.spyOn(Vehicle, "findById").mockResolvedValue({ _id: vehicleId } as never);

        jest
            .spyOn(Vehicle, "findByIdAndUpdate")
            .mockResolvedValue(updatedVehicle as never);

        const result = await updateVehicle(vehicleId, {
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 5000000,
            quantity: 5,
        });

        expect(Vehicle.findById).toHaveBeenCalledWith(vehicleId);

        expect(Vehicle.findByIdAndUpdate).toHaveBeenCalledWith(
            vehicleId,
            {
                make: "Toyota",
                model: "Fortuner",
                category: "SUV",
                price: 5000000,
                quantity: 5,
            },
            { new: true }
        );

        expect(result).toEqual(updatedVehicle);
    });

    it("should update only provided fields", async () => {
        const updatedVehicle = {
            _id: vehicleId,
            price: 6000000,
        };

        jest.spyOn(Vehicle, "findById").mockResolvedValue({ _id: vehicleId } as never);

        jest
            .spyOn(Vehicle, "findByIdAndUpdate")
            .mockResolvedValue(updatedVehicle as never);

        const result = await updateVehicle(vehicleId, {
            price: 6000000,
        });

        expect(Vehicle.findByIdAndUpdate).toHaveBeenCalledWith(
            vehicleId,
            { price: 6000000 },
            { new: true }
        );

        expect(result).toEqual(updatedVehicle);
    });

    it("should throw error for invalid ObjectId", async () => {
        const findByIdSpy = jest.spyOn(Vehicle, "findById");

        await expect(
            updateVehicle("invalid-id", {})
        ).rejects.toThrow("Invalid vehicle ID.");

        expect(findByIdSpy).not.toHaveBeenCalled();
    });

    it("should throw error when vehicle does not exist", async () => {
        jest.spyOn(Vehicle, "findById").mockResolvedValue(null);

        await expect(
            updateVehicle(vehicleId, {})
        ).rejects.toThrow("Vehicle not found.");
    });

    it("should throw error when make is not string", async () => {
        jest.spyOn(Vehicle, "findById").mockResolvedValue({} as any);

        await expect(
            updateVehicle(vehicleId, {
                make: 123,
            })
        ).rejects.toThrow("Make must be a non-empty string.");
    });

    it("should throw error when model is not string", async () => {
        jest.spyOn(Vehicle, "findById").mockResolvedValue({} as never);

        await expect(
            updateVehicle(vehicleId, {
                model: 100,
            })
        ).rejects.toThrow("Model must be a non-empty string.");
    });

    it("should throw error when category is not string", async () => {
        jest.spyOn(Vehicle, "findById").mockResolvedValue({} as never);

        await expect(
            updateVehicle(vehicleId, {
                category: true,
            })
        ).rejects.toThrow("Category must be a non-empty string.");
    });

    it("should throw error when price is not a number", async () => {
        jest.spyOn(Vehicle, "findById").mockResolvedValue({} as never);

        await expect(
            updateVehicle(vehicleId, {
                price: "1000",
            })
        ).rejects.toThrow(
            "Price must be a number and must be greater than or equal to 0."
        );
    });

    it("should throw error when price is negative", async () => {
        jest.spyOn(Vehicle, "findById").mockResolvedValue({} as never);

        await expect(
            updateVehicle(vehicleId, {
                price: -100,
            })
        ).rejects.toThrow(
            "Price must be a number and must be greater than or equal to 0."
        );
    });

    it("should throw error when quantity is negative", async () => {
        jest.spyOn(Vehicle, "findById").mockResolvedValue({} as never);

        await expect(
            updateVehicle(vehicleId, {
                quantity: -1,
            })
        ).rejects.toThrow("Quantity must be a non-negative integer.");
    });

    it("should throw error when quantity is decimal", async () => {
        jest.spyOn(Vehicle, "findById").mockResolvedValue({} as never);

        await expect(
            updateVehicle(vehicleId, {
                quantity: 2.5,
            })
        ).rejects.toThrow("Quantity must be a non-negative integer.");
    });

    it("should throw database error when findById fails", async () => {
        jest
            .spyOn(Vehicle, "findById")
            .mockRejectedValue(new Error("Database error"));

        await expect(
            updateVehicle(vehicleId, {})
        ).rejects.toThrow("Database error");
    });

    it("should throw database error when findByIdAndUpdate fails", async () => {
        jest.spyOn(Vehicle, "findById").mockResolvedValue({} as never);

        jest
            .spyOn(Vehicle, "findByIdAndUpdate")
            .mockRejectedValue(new Error("Database error"));

        await expect(
            updateVehicle(vehicleId, {
                price: 1000,
            })
        ).rejects.toThrow("Database error");
    });

});