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

  it("should throw error when price is negative", async () => {
    await expect(
      addVehicle({
        ...vehicleData,
        price: -1,
      })
    ).rejects.toThrow(
      "Price must be a number and must be greater than or equal to 0."
    );
  });

  it("should throw error when price is not a number", async () => {
    await expect(
      addVehicle({
        ...vehicleData,
        price: "100",
      })
    ).rejects.toThrow(
      "Price must be a number and must be greater than or equal to 0."
    );
  });

  it("should throw error when quantity is negative", async () => {
    await expect(
      addVehicle({
        ...vehicleData,
        quantity: -1,
      })
    ).rejects.toThrow(
      "Quantity must be a non-negative integer."
    );
  });

  it("should throw error when quantity is not an integer", async () => {
    await expect(
      addVehicle({
        ...vehicleData,
        quantity: 1.5,
      })
    ).rejects.toThrow(
      "Quantity must be a non-negative integer."
    );
  });



});