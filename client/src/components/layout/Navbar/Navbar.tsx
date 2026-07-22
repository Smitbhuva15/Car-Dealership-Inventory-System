import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Car, LogOut, LogIn, UserPlus, Shield, Menu, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Company Logo (Left) */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-[#8948E5] p-0.5 shadow-md shadow-[#8948E5]/20 group-hover:shadow-[#8948E5]/30 transition-all duration-300">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Car className="w-6 h-6 text-[#8948E5] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider text-slate-900">
                AutoVault
              </span>
              <span className="text-xs text-[#8948E5] font-bold tracking-widest uppercase">
                Dealership
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links & Action Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              /* Unauthenticated State: Only Login & Signup buttons */
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-[#8948E5] hover:bg-slate-100 transition-all duration-200"
                >
                  <LogIn className="w-4 h-4 mr-2 text-[#8948E5]" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#8948E5] hover:bg-[#7637d4] shadow-md shadow-[#8948E5]/20 hover:shadow-lg hover:shadow-[#8948E5]/30 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Link>
              </div>
            ) : (
              /* Authenticated State: Nav links + User badge + Logout */
              <div className="flex items-center space-x-6">
                <nav className="flex items-center space-x-1">
                  <Link
                    to="/"
                    className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive("/")
                        ? "bg-[#8948E5]/10 text-[#8948E5] font-bold"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/vehicles"
                    className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive("/vehicles")
                        ? "bg-[#8948E5]/10 text-[#8948E5] font-bold"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    Vehicles
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center ${
                        isActive("/admin")
                          ? "bg-purple-100 text-purple-700 font-bold"
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <Shield className="w-4 h-4 mr-1.5 text-purple-600" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive("/profile")
                        ? "bg-[#8948E5]/10 text-[#8948E5] font-bold"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    Profile
                  </Link>
                </nav>

                {/* User Profile Info Pill */}
                <div className="flex items-center pl-4 border-l border-slate-200 space-x-3">
                  <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                    <div className="w-7 h-7 rounded-full bg-[#8948E5] text-white flex items-center justify-center font-bold text-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 leading-tight">
                        {user?.name}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        user?.role === "admin" ? "text-purple-600" : "text-[#8948E5]"
                      }`}>
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          {!isAuthenticated ? (
            <div className="flex flex-col space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm font-semibold"
              >
                <LogIn className="w-4 h-4 mr-2 text-[#8948E5]" />
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-white bg-[#8948E5] hover:bg-[#7637d4] text-sm font-semibold"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 pt-2">
              <div className="px-3 py-2 border-b border-slate-200 flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#8948E5] text-white flex items-center justify-center font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{user?.name}</div>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                </div>
              </div>

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                Home
              </Link>
              <Link
                to="/vehicles"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                Vehicles
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-purple-700 hover:bg-purple-50"
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 flex items-center mt-2"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
