import { useState, useEffect } from "react";
import { Car, AlertCircle, RefreshCw, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { getAllVehicles, searchVehiclesApi, type Vehicle, type SearchFilters } from "../services/api";
import { useAuth } from "../context/AuthContext";
import AdvancedSearchFilter from "../components/AdvancedSearchFilter";
import PurchaseModal from "../components/PurchaseModal";

const Vehicles = () => {
  const { isAuthenticated } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<SearchFilters | null>(null);

  // Purchase modal state
  const [purchaseVehicleItem, setPurchaseVehicleItem] = useState<Vehicle | null>(null);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState<boolean>(false);

  const fetchVehicles = async (filters?: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);

      let data: Vehicle[];
      if (filters && (filters.make || filters.model || (filters.category && filters.category !== "All") || filters.minPrice || filters.maxPrice)) {
        data = await searchVehiclesApi(filters);
      } else {
        data = await getAllVehicles();
      }

      setVehicles(data);
    } catch (err: any) {
      const errorMsg = err.message || "Failed to load vehicle inventory.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSearch = (filters: SearchFilters) => {
    setActiveFilters(filters);
    fetchVehicles(filters);
  };

  const handleResetFilters = () => {
    setActiveFilters(null);
    fetchVehicles();
  };

  const handleOpenPurchase = (vehicle: Vehicle) => {
    if (!isAuthenticated) {
      toast.error("Please login to purchase vehicles.");
      return;
    }
    setPurchaseVehicleItem(vehicle);
    setIsPurchaseOpen(true);
  };

  return (
    <div className="space-y-8 py-4 w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Vehicles</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse our full dealership inventory of verified vehicles in Indian Rupees (₹)
          </p>
        </div>
        <button
          onClick={() => fetchVehicles(activeFilters || undefined)}
          className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors self-start sm:self-auto"
          title="Refresh List"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Advanced Search & Filter Bar */}
      <AdvancedSearchFilter
        onSearch={handleSearch}
        onReset={handleResetFilters}
      />

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchVehicles(activeFilters || undefined)}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded-lg text-xs font-bold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Grid Display */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#8948E5] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium">Searching inventory...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#8948E5]/10 text-[#8948E5] flex items-center justify-center mx-auto">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Vehicles Found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            {activeFilters
              ? "No vehicle matches your filter criteria. Try expanding search parameters."
              : "No vehicle listings are currently published in the catalog."}
          </p>
          {activeFilters && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[#8948E5]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#8948E5]/10 text-[#8948E5]">
                    {vehicle.category}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      vehicle.quantity > 0
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {vehicle.quantity > 0 ? `${vehicle.quantity} Available` : "Out of Stock"}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    {vehicle.make} {vehicle.model}
                  </h3>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Price</span>
                  <span className="text-2xl font-extrabold text-[#8948E5]">
                    ₹{vehicle.price?.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Purchase Action Button */}
                <button
                  onClick={() => handleOpenPurchase(vehicle)}
                  disabled={vehicle.quantity <= 0}
                  className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#8948E5] hover:bg-[#7637d4] shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ShoppingBag className="w-4 h-4 mr-1.5" />
                  <span>Purchase</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Purchase Modal */}
      <PurchaseModal
        vehicle={purchaseVehicleItem}
        isOpen={isPurchaseOpen}
        onClose={() => {
          setIsPurchaseOpen(false);
          setPurchaseVehicleItem(null);
        }}
        onSuccess={() => fetchVehicles(activeFilters || undefined)}
      />
    </div>
  );
};

export default Vehicles;