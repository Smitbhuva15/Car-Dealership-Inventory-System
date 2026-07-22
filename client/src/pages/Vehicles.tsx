const Vehicles = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Vehicle Inventory</h1>
          <p className="text-slate-500 text-sm mt-1">Browse available cars and dealership listings</p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md text-center space-y-3">
        <p className="text-slate-800 font-semibold">
          Welcome to the protected Vehicle Inventory page!
        </p>
        <p className="text-slate-500 text-sm">
          Vehicle listings will appear here.
        </p>
      </div>
    </div>
  );
};

export default Vehicles;