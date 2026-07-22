import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">403 - Unauthorized Access</h1>
      <p className="text-slate-600 max-w-md">
        You do not have permission to view this page. Admin access is required.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-xl bg-[#8948E5] hover:bg-[#7637d4] text-white font-bold text-sm transition-colors shadow-md shadow-[#8948E5]/20"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default Unauthorized;