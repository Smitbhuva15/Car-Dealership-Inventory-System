import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Car, PlusCircle, AlertCircle, Layers, Tag, Hash } from "lucide-react";
import toast from "react-hot-toast";
import { addVehicle } from "../services/api";

const AddVehicle = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    category: "Sedan",
    price: "",
    quantity: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const categories = ["Sedan", "SUV", "Truck", "Coupe", "Electric", "Hybrid", "Convertible", "Van", "Luxury"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) {
      setApiError(null);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.make.trim()) {
      newErrors.make = "Make is required (e.g. Toyota, Tesla).";
    }

    if (!formData.model.trim()) {
      newErrors.model = "Model is required (e.g. Camry, Model 3).";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required.";
    }

    const priceNum = parseFloat(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum < 0) {
      newErrors.price = "Price must be a valid number greater than or equal to 0.";
    }

    const quantityNum = parseInt(formData.quantity, 10);
    if (
      !formData.quantity ||
      isNaN(quantityNum) ||
      quantityNum < 0 ||
      !Number.isInteger(parseFloat(formData.quantity))
    ) {
      newErrors.quantity = "Quantity must be a valid non-negative integer.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const res = await addVehicle({
        make: formData.make.trim(),
        model: formData.model.trim(),
        category: formData.category.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
      });

      toast.success(res.message || "Vehicle added successfully!");
      navigate("/admin");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to add vehicle. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      {/* Back Button & Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/admin"
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          title="Back to Admin Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Add New Vehicle</h1>
          <p className="text-sm text-slate-500">Fill in the details to add a new car to the dealership inventory</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl space-y-6">
        
        {apiError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Make */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Make <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Tag className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  placeholder="e.g. Toyota, BMW"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border ${
                    errors.make ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-[#8948E5]"
                  } text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#8948E5]/30 transition-all`}
                />
              </div>
              {errors.make && <p className="text-xs text-red-500 mt-1">{errors.make}</p>}
            </div>

            {/* Model */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Model <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Car className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. Camry, M3"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border ${
                    errors.model ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-[#8948E5]"
                  } text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#8948E5]/30 transition-all`}
                />
              </div>
              {errors.model && <p className="text-xs text-red-500 mt-1">{errors.model}</p>}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Layers className="w-5 h-5" />
              </div>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border ${
                  errors.category ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-[#8948E5]"
                } text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8948E5]/30 transition-all`}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Price */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                  ₹
                </div>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="1500000"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border ${
                    errors.price ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-[#8948E5]"
                  } text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#8948E5]/30 transition-all`}
                />
              </div>
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>

            {/* Quantity */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Quantity in Stock <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Hash className="w-5 h-5" />
                </div>
                <input
                  type="number"
                  name="quantity"
                  step="1"
                  min="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="5"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border ${
                    errors.quantity ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-[#8948E5]"
                  } text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#8948E5]/30 transition-all`}
                />
              </div>
              {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-100">
            <Link
              to="/admin"
              className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#8948E5] hover:bg-[#7637d4] shadow-md shadow-[#8948E5]/20 hover:shadow-lg disabled:opacity-50 transition-all flex items-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Save Vehicle</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;