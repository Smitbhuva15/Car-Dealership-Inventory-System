import React, { useState } from "react";
import { X, PackagePlus, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { restockVehicle, type Vehicle } from "../services/api";

interface RestockModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RestockModal: React.FC<RestockModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [quantity, setQuantity] = useState<string>("1");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numQuantity = parseInt(quantity, 10);
    if (!quantity || isNaN(numQuantity) || numQuantity <= 0) {
      setError("Please enter a valid restock quantity greater than 0.");
      return;
    }

    setLoading(true);

    try {
      const res = await restockVehicle(vehicle._id, numQuantity);
      toast.success(res.message || `Successfully added ${numQuantity} units to ${vehicle.make} ${vehicle.model}!`);
      setQuantity("1");
      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to restock vehicle.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8948E5]/10 text-[#8948E5] flex items-center justify-center">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Restock Vehicle</h3>
              <p className="text-xs text-slate-500">Update available inventory quantity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Info Summary Card */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-semibold uppercase">Vehicle</span>
            <span className="font-extrabold text-slate-900">
              {vehicle.make} {vehicle.model}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-semibold uppercase">Category</span>
            <span className="font-semibold text-slate-700">{vehicle.category}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
            <span className="text-xs text-slate-500 font-semibold uppercase">Current Stock</span>
            <span className="font-extrabold text-[#8948E5]">{vehicle.quantity} Units</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Restock Quantity (Units to add) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. 10"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#8948E5] focus:ring-2 focus:ring-[#8948E5]/20 transition-all"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#8948E5] hover:bg-[#7637d4] shadow-md shadow-[#8948E5]/20 hover:shadow-lg disabled:opacity-50 transition-all flex items-center space-x-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <PackagePlus className="w-4 h-4" />
                  <span>Confirm Restock</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestockModal;
