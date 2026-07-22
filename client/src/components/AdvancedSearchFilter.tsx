import React, { useState } from "react";
import { Search, Filter, RotateCcw, Tag, Layers, ChevronDown, ChevronUp } from "lucide-react";
import type { SearchFilters } from "../services/api";

interface AdvancedSearchFilterProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
  categories?: string[];
}

const AdvancedSearchFilter: React.FC<AdvancedSearchFilterProps> = ({
  onSearch,
  onReset,
  categories = ["Sedan", "SUV", "Truck", "Coupe", "Electric", "Hybrid", "Convertible", "Van", "Luxury"],
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    make: "",
    model: "",
    category: "All",
    minPrice: "",
    maxPrice: "",
  });

  const [expanded, setExpanded] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onSearch(updatedFilters);
  };

  const handleReset = () => {
    const resetState: SearchFilters = {
      make: "",
      model: "",
      category: "All",
      minPrice: "",
      maxPrice: "",
    };
    setFilters(resetState);
    onReset();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const activeFilterCount = [
    filters.make,
    filters.model,
    filters.category !== "All" ? filters.category : "",
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="w-full max-w-full overflow-hidden box-border min-w-0 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Header & Quick Search */}
      <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full min-w-0">
        {/* Quick Search Input (Make) */}
        <div className="relative w-full sm:flex-1 min-w-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            name="make"
            value={filters.make || ""}
            onChange={handleChange}
            placeholder="Search by vehicle make (e.g. Toyota, BMW)..."
            className="w-full min-w-0 box-border pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#8948E5] focus:ring-2 focus:ring-[#8948E5]/20 transition-all"
          />
        </div>

        {/* Filter Toggle & Reset Buttons */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end flex-shrink-0">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className={`inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              expanded || activeFilterCount > 0
                ? "bg-[#8948E5]/10 border-[#8948E5]/30 text-[#8948E5]"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Filter className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Advanced Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-2 w-5 h-5 rounded-full bg-[#8948E5] text-white flex items-center justify-center text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
            {expanded ? <ChevronUp className="w-4 h-4 ml-2 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />}
          </button>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex-shrink-0"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Reset
            </button>
          )}
        </div>
      </form>

      {/* Expanded Advanced Filters Panel */}
      {expanded && (
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full min-w-0 box-border transition-all duration-300">
          {/* Model Filter */}
          <div className="space-y-1 min-w-0">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Model
            </label>
            <div className="relative w-full min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="model"
                value={filters.model || ""}
                onChange={handleChange}
                placeholder="e.g. Camry, M3"
                className="w-full min-w-0 box-border pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#8948E5] transition-all"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-1 min-w-0">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Category
            </label>
            <div className="relative w-full min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Layers className="w-4 h-4" />
              </div>
              <select
                name="category"
                value={filters.category || "All"}
                onChange={handleChange}
                className="w-full min-w-0 box-border pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#8948E5] transition-all"
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Min Price Filter */}
          <div className="space-y-1 min-w-0">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Min Price (₹)
            </label>
            <div className="relative w-full min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                ₹
              </div>
              <input
                type="number"
                name="minPrice"
                min="0"
                value={filters.minPrice !== undefined ? filters.minPrice : ""}
                onChange={handleChange}
                placeholder="Min Price (₹)"
                className="w-full min-w-0 box-border pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#8948E5] transition-all"
              />
            </div>
          </div>

          {/* Max Price Filter */}
          <div className="space-y-1 min-w-0">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Max Price (₹)
            </label>
            <div className="relative w-full min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                ₹
              </div>
              <input
                type="number"
                name="maxPrice"
                min="0"
                value={filters.maxPrice !== undefined ? filters.maxPrice : ""}
                onChange={handleChange}
                placeholder="Max Price (₹)"
                className="w-full min-w-0 box-border pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#8948E5] transition-all"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchFilter;
