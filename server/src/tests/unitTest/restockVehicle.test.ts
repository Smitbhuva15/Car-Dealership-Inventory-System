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

});