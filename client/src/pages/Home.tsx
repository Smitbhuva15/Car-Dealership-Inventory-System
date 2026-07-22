import { Link } from "react-router-dom";
import { Car, ShieldCheck, ArrowRight, CheckCircle2, Sparkles, Database } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-purple-50/40 to-white border border-slate-200 p-8 sm:p-12 lg:p-16 shadow-lg">
        {/* Decorative subtle background accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#8948E5]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
        
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Streamlined Management for Your{" "}
            <span className="text-[#8948E5]">
              Car Dealership
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
            AutoVault is a complete inventory management system built to catalog, manage, and track vehicle listings with enterprise security and role-based controls.
          </p>

          {/* Call to Action Buttons */}
          <div className="pt-4 flex flex-wrap gap-4 items-center">
            {isAuthenticated ? (
              <Link
                to={user?.role === "admin" ? "/admin" : "/vehicles"}
                className="inline-flex items-center px-6 py-3.5 rounded-xl text-base font-bold text-white bg-[#8948E5] hover:bg-[#7637d4] shadow-lg shadow-[#8948E5]/25 hover:shadow-xl hover:shadow-[#8948E5]/35 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {user?.role === "admin" ? "Go to Admin Dashboard" : "Browse Vehicle Inventory"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-7 py-3.5 rounded-xl text-base font-bold text-white bg-[#8948E5] hover:bg-[#7637d4] shadow-lg shadow-[#8948E5]/25 hover:shadow-xl hover:shadow-[#8948E5]/35 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 hover:text-slate-900 transition-all duration-200 shadow-sm"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-200 text-xs text-slate-600 font-medium">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#8948E5]" />
              <span>Role-Based Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#8948E5]" />
              <span>Real-Time Inventory</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#8948E5]" />
              <span>HttpOnly Cookie Auth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Designed for Modern Dealership Operations
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Everything you need to showcase, monitor, and configure vehicle details efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#8948E5]/50 hover:shadow-lg transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#8948E5]/10 text-[#8948E5] flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Vehicle Showcase</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Comprehensive inventory catalog displaying vehicle models, pricing, specification status, and imagery seamlessly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Role Authorization</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Granular access control separating regular users from dealership administrators with protected route middleware.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#8948E5]/50 hover:shadow-lg transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#8948E5]/10 text-[#8948E5] flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Admin Management</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Effortlessly create, update, and remove vehicle entries from the dealership catalog with real-time feedback.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;