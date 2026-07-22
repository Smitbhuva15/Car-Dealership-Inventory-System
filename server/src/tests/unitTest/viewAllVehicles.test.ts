import { Vehicle } from "../../model/Vehicle";
import { viewAllVehicles } from "../../services/viewAllVehicles";


describe("viewAllVehicles service", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return all vehicles", async () => {
    const vehicles = [
      {
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 4500000,
        quantity: 5,
      },
      {
        make: "Honda",
        model: "City",
        category: "Sedan",
        price: 1500000,
        quantity: 8,
      },
    ];

    jest.spyOn(Vehicle, "find").mockResolvedValue(vehicles as never);

    const result = await viewAllVehicles();

    expect(Vehicle.find).toHaveBeenCalled();
    expect(result).toEqual(vehicles);
  });

  it("should return an empty array when no vehicles exist", async () => {
    jest.spyOn(Vehicle, "find").mockResolvedValue([] as any);

    const result = await viewAllVehicles();

    expect(Vehicle.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  it("should throw an error when Vehicle.find fails", async () => {
    jest.spyOn(Vehicle, "find").mockRejectedValue(new Error("Database error"));

    await expect(viewAllVehicles()).rejects.toThrow(
      "Failed to fetch vehicles."
    );

    expect(Vehicle.find).toHaveBeenCalledTimes(1);
  });

});