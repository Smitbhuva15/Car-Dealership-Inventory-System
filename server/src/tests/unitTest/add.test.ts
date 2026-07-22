import { addVehicle } from "../../services/addVehicle";
import { Vehicle } from "../../model/Vehicle";

describe("addVehicle", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should create a vehicle successfully", async () => {
    const vehicleData = {
      make: "Toyota",
      model: "Fortuner",
      category: "SUV",
      price: 4500000,
      quantity: 5,
    };

    const savedVehicle = {
      _id: "1",
      ...vehicleData,
    };

    jest
      .spyOn(Vehicle.prototype, "save")
      .mockResolvedValue(savedVehicle as never);

    const result = await addVehicle(vehicleData);

    expect(result).toEqual(savedVehicle);
  });
});