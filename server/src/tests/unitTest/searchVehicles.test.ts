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

    it("should search by make", async () => {
        jest.spyOn(Vehicle, "find").mockResolvedValue([] as never);

        await searchVehicles({ make: "Toyota" });

        expect(Vehicle.find).toHaveBeenCalledWith({
            make: { $regex: "Toyota", $options: "i" },
        });
    });

    it("should search by model", async () => {
        jest.spyOn(Vehicle, "find").mockResolvedValue([] as never);

        await searchVehicles({ model: "Fortuner" });

        expect(Vehicle.find).toHaveBeenCalledWith({
            model: { $regex: "Fortuner", $options: "i" },
        });
    });

    it("should search by category", async () => {
        jest.spyOn(Vehicle, "find").mockResolvedValue([] as never);

        await searchVehicles({ category: "SUV" });

        expect(Vehicle.find).toHaveBeenCalledWith({
            category: { $regex: "SUV", $options: "i" },
        });
    });

    it("should search by minimum price", async () => {
        jest.spyOn(Vehicle, "find").mockResolvedValue([] as never);

        await searchVehicles({ minPrice: "1000000" });

        expect(Vehicle.find).toHaveBeenCalledWith({
            price: {
                $gte: 1000000,
            },
        });
    });

    it("should search by maximum price", async () => {
        jest.spyOn(Vehicle, "find").mockResolvedValue([] as never);

        await searchVehicles({ maxPrice: "5000000" });

        expect(Vehicle.find).toHaveBeenCalledWith({
            price: {
                $lte: 5000000,
            },
        });
    });

    it("should search by price range", async () => {
        jest.spyOn(Vehicle, "find").mockResolvedValue([] as never);

        await searchVehicles({
            minPrice: "1000000",
            maxPrice: "5000000",
        });

        expect(Vehicle.find).toHaveBeenCalledWith({
            price: {
                $gte: 1000000,
                $lte: 5000000,
            },
        });
    });

    it("should search using all filters", async () => {
        jest.spyOn(Vehicle, "find").mockResolvedValue([] as never);

        await searchVehicles({
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            minPrice: "1000000",
            maxPrice: "5000000",
        });

        expect(Vehicle.find).toHaveBeenCalledWith({
            make: { $regex: "Toyota", $options: "i" },
            model: { $regex: "Fortuner", $options: "i" },
            category: { $regex: "SUV", $options: "i" },
            price: {
                $gte: 1000000,
                $lte: 5000000,
            },
        });
    });

});