import React, { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { deleteVehicle, type Vehicle} from "../services/api";

interface DeleteConfirmModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen || !vehicle) return null;

  const handleConfirmDelete = async () => {
    setLoading(true);

    try {
      const res = await deleteVehicle(vehicle._id);
      toast.success(res.message || `Successfully deleted ${vehicle.make} ${vehicle.model}`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete vehicle.");
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
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Delete Vehicle</h3>
              <p className="text-xs text-slate-500">Confirm permanent deletion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Message */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-800">
            Are you sure you want to delete this vehicle?
          </p>
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs space-y-1 text-slate-600">
            <div className="font-bold text-slate-900 text-sm">
              {vehicle.make} {vehicle.model}
            </div>
            <div>Category: {vehicle.category} | Price: ₹{vehicle.price?.toLocaleString('en-IN')}</div>
            <div>Stock: {vehicle.quantity} Units</div>
          </div>
          <p className="text-xs text-slate-400">
            This action cannot be undone and will permanently remove this record from the dealership catalog.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 hover:shadow-lg disabled:opacity-50 transition-all flex items-center space-x-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
