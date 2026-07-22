import mongoose from "mongoose";
import { Vehicle } from "../../model/Vehicle";
import { deleteVehicle } from "../../services/vehicleService";

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

});