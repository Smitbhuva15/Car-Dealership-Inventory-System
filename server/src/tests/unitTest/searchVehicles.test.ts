import { Vehicle } from "../../model/Vehicle";
import { searchVehicles } from "../../services/searchVehicles";

describe("searchVehicles service", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return all vehicles when no filters are provided", async () => {
    const vehicles = [
      { make: "Toyota" },
      { make: "Honda" },
    ];

    jest.spyOn(Vehicle, "find").mockResolvedValue(vehicles as never);

    const result = await searchVehicles({});

    expect(Vehicle.find).toHaveBeenCalledWith({});
    expect(result).toEqual(vehicles);
  });

  
});