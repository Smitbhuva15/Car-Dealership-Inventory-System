import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, PackagePlus, Car, AlertCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { getAllVehicles, searchVehiclesApi, type Vehicle, type SearchFilters } from "../services/api";
import RestockModal from "../components/RestockModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import AdvancedSearchFilter from "../components/AdvancedSearchFilter";

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Restock modal state
  const [restockVehicleItem, setRestockVehicleItem] = useState<Vehicle | null>(null);
  const [isRestockOpen, setIsRestockOpen] = useState<boolean>(false);

  // Delete modal state
  const [deleteVehicleItem, setDeleteVehicleItem] = useState<Vehicle | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  // Active filters state
  const [activeFilters, setActiveFilters] = useState<SearchFilters | null>(null);

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

  const handleOpenDelete = (vehicle: Vehicle) => {
    setDeleteVehicleItem(vehicle);
    setIsDeleteOpen(true);
  };

  const handleOpenRestock = (vehicle: Vehicle) => {
    setRestockVehicleItem(vehicle);
    setIsRestockOpen(true);
  };

  return (
    <div className="space-y-8 py-4 w-full max-w-full overflow-x-hidden min-w-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your dealership vehicle listings, stock restock, and pricing in Indian Rupees (₹)
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchVehicles(activeFilters || undefined)}
            className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            to="/admin/vehicles/add"
            className="inline-flex items-center px-5 py-3 rounded-xl text-sm font-bold text-white bg-[#8948E5] hover:bg-[#7637d4] shadow-md shadow-[#8948E5]/20 hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Vehicle
          </Link>
        </div>
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

      {/* Table / Grid Section */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#8948E5] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium">Loading inventory data...</p>
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
              : "Your dealership inventory is currently empty. Click 'Add New Vehicle' to create your first vehicle listing."}
          </p>
          {activeFilters ? (
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200"
            >
              Reset Search Filters
            </button>
          ) : (
            <Link
              to="/admin/vehicles/add"
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#8948E5] hover:bg-[#7637d4]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Vehicle
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Vehicle</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price (₹)</th>
                  <th className="py-4 px-6">Stock Quantity</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Make & Model */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-[#8948E5]/10 text-[#8948E5] flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {vehicle.make ? vehicle.make.charAt(0).toUpperCase() : "C"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {vehicle.make} {vehicle.model}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">ID: {vehicle._id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {vehicle.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-slate-900">
                        ₹{vehicle.price?.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Stock Quantity */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          vehicle.quantity > 0
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-600 border border-red-200"
                        }`}
                      >
                        {vehicle.quantity > 0 ? `${vehicle.quantity} In Stock` : "Out of Stock"}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right space-x-1.5">
                      {/* Restock Button */}
                      <button
                        onClick={() => handleOpenRestock(vehicle)}
                        className="inline-flex items-center px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#8948E5] bg-[#8948E5]/10 hover:bg-[#8948E5]/20 transition-colors"
                        title="Restock Vehicle"
                      >
                        <PackagePlus className="w-3.5 h-3.5 mr-1" />
                        Restock
                      </button>

                      {/* Edit Button */}
                      <Link
                        to={`/admin/vehicles/edit/${vehicle._id}`}
                        className="inline-flex items-center p-2 rounded-xl text-slate-600 hover:text-[#8948E5] hover:bg-[#8948E5]/10 transition-colors"
                        title="Edit Vehicle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleOpenDelete(vehicle)}
                        className="inline-flex items-center p-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Vehicle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      <RestockModal
        vehicle={restockVehicleItem}
        isOpen={isRestockOpen}
        onClose={() => {
          setIsRestockOpen(false);
          setRestockVehicleItem(null);
        }}
        onSuccess={() => fetchVehicles(activeFilters || undefined)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        vehicle={deleteVehicleItem}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteVehicleItem(null);
        }}
        onSuccess={() => fetchVehicles(activeFilters || undefined)}
      />
    </div>
  );
};

export default AdminDashboard;