import mongoose from "mongoose";
import { Vehicle } from "../../model/Vehicle";
import { purchaseVehicle } from "../../services/purchaseVehicle";

describe("purchaseVehicle service", () => {
  const vehicleId = new mongoose.Types.ObjectId().toString();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should purchase vehicle successfully", async () => {
    const saveMock = jest.fn().mockResolvedValue({
      _id: vehicleId,
      make: "Toyota",
      quantity: 5,
    });

    const vehicle = {
      _id: vehicleId,
      make: "Toyota",
      quantity: 10,
      save: saveMock,
    };

    jest.spyOn(Vehicle, "findById").mockResolvedValue(vehicle as never);

    const result = await purchaseVehicle(vehicleId, 5);

    expect(Vehicle.findById).toHaveBeenCalledWith(vehicleId);
    expect(vehicle.quantity).toBe(5);
    expect(saveMock).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      message: "Vehicle purchased successfully.",
      vehicle: {
        _id: vehicleId,
        make: "Toyota",
        quantity: 5,
      },
    });
  });

  
});