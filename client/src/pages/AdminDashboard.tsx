import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Search, Car, AlertCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { getAllVehicles, deleteVehicle, type Vehicle,  } from "../services/api";

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllVehicles();
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

  const handleDelete = async (id: string, make: string, model: string) => {
    if (!window.confirm(`Are you sure you want to delete ${make} ${model}?`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await deleteVehicle(id);
      toast.success(res.message || "Vehicle deleted successfully!");
      setVehicles((prev) => prev.filter((v) => v._id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete vehicle.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter vehicles
  const categories = ["All", ...Array.from(new Set(vehicles.map((v) => v.category).filter(Boolean)))];

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 py-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your dealership vehicle listings, stock, and pricing
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchVehicles}
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

      {/* Search & Category Filter Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search make, model, or category..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#8948E5] focus:ring-2 focus:ring-[#8948E5]/20 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2 hidden lg:inline">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-[#8948E5] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchVehicles}
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
      ) : filteredVehicles.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#8948E5]/10 text-[#8948E5] flex items-center justify-center mx-auto">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Vehicles Found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            {searchQuery || selectedCategory !== "All"
              ? "No vehicle matches your current filter criteria. Try clearing search query."
              : "Your dealership inventory is currently empty. Click 'Add New Vehicle' to create your first vehicle listing."}
          </p>
          {searchQuery || selectedCategory !== "All" ? (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200"
            >
              Clear Filters
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
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Stock Quantity</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {filteredVehicles.map((vehicle) => (
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
                        ${vehicle.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        to={`/admin/vehicles/edit/${vehicle._id}`}
                        className="inline-flex items-center p-2 rounded-xl text-slate-600 hover:text-[#8948E5] hover:bg-[#8948E5]/10 transition-colors"
                        title="Edit Vehicle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(vehicle._id, vehicle.make, vehicle.model)}
                        disabled={deletingId === vehicle._id}
                        className="inline-flex items-center p-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete Vehicle"
                      >
                        {deletingId === vehicle._id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;