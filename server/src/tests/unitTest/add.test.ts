import { addVehicle } from "../../services/addVehicle";
import { Vehicle } from "../../model/Vehicle";

describe("addVehicle", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const vehicleData = {
    make: "Toyota",
    model: "Fortuner",
    category: "SUV",
    price: 4500000,
    quantity: 5,
  };

  it("should create a vehicle successfully", async () => {

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

  it("should throw error when make is missing", async () => {
    await expect(
      addVehicle({
        ...vehicleData,
        make: "",
      })
    ).rejects.toThrow(
      "Make is required and must be a non-empty string."
    );
  });

  it("should throw error when model is missing", async () => {
    await expect(
      addVehicle({
        ...vehicleData,
        model: "",
      })
    ).rejects.toThrow(
      "Model is required and must be a non-empty string."
    );
  });

  it("should throw error when category is missing", async () => {
    await expect(
      addVehicle({
        ...vehicleData,
        category: "",
      })
    ).rejects.toThrow(
      "Category is required and must be a non-empty string."
    );
  });



});