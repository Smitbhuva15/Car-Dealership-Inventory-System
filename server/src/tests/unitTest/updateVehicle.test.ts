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

});