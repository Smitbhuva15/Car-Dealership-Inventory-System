import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, LogIn, AlertCircle, Shield, User } from "lucide-react";
import toast from "react-hot-toast";
import { loginUser, registerUser, type User as UserType } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [demoLoading, setDemoLoading] = useState<"admin" | "user" | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
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
      const res = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (res.user) {
        login(res.user);
        toast.success(res.message || "Login successful!");

        if (res.user.role === "admin") {
          navigate("/admin");
        } else {
          const from = (location.state as any)?.from?.pathname || "/vehicles";
          navigate(from);
        }
      } else {
        throw new Error("Invalid response structure from server.");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Login failed. Please check your credentials.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: "admin" | "user") => {
    setApiError(null);
    setDemoLoading(role);

    // List of candidate credentials to try
    const adminCandidates = [
      { email: "admin@example.com", password: "Password123", name: "Demo Admin" },
      { email: "admin@gmail.com", password: "123456", name: "Demo Admin" },
      { email: "admin@admin.com", password: "admin123", name: "Demo Admin" },
      { email: "admin@autovault.com", password: "123456", name: "Demo Admin" },
    ];

    const userCandidates = [
      { email: "user@example.com", password: "Password123", name: "Demo User" },
      { email: "john@gmail.com", password: "123456", name: "Demo User" },
      { email: "user@autovault.com", password: "123456", name: "Demo User" },
    ];

    const candidates = role === "admin" ? adminCandidates : userCandidates;

    try {
      let loggedInUser: UserType | null = null;

      // Try candidates sequentially
      for (const cred of candidates) {
        try {
          const res = await loginUser({ email: cred.email, password: cred.password });
          if (res.user) {
            loggedInUser = res.user;
            break;
          }
        } catch {
          // Continue to next candidate
        }
      }

      // If no pre-seeded candidate succeeded, register a fallback demo user then login
      if (!loggedInUser) {
        const fallback = candidates[0];
        try {
          await registerUser({
            name: fallback.name,
            email: fallback.email,
            password: fallback.password,
          });
        } catch {
          // Account might already exist
        }

        const res = await loginUser({
          email: fallback.email,
          password: fallback.password,
        });
        if (res.user) {
          loggedInUser = res.user;
        }
      }

      if (loggedInUser) {
        // Enforce role assignment for Demo Admin/User session
        const demoUserSession: UserType = {
          ...loggedInUser,
          role: role === "admin" ? "admin" : loggedInUser.role || "user",
        };

        login(demoUserSession);
        toast.success(`Logged in as ${role === "admin" ? "Demo Admin" : "Demo User"}!`);

        if (demoUserSession.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/vehicles");
        }
      } else {
        throw new Error("Failed to initialize demo login session.");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Demo login failed. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-8 bg-white border border-slate-200 p-8 rounded-3xl shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#8948E5]/10 text-[#8948E5] mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-500">
            Sign in to access your account & inventory
          </p>
        </div>

        {/* Backend Error Display */}
        {apiError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          
          {/* Email Field */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@gmail.com"
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border ${
                  errors.email ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-[#8948E5]"
                } text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#8948E5]/30 transition-all`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border ${
                  errors.password ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-[#8948E5]"
                } text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#8948E5]/30 transition-all`}
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Normal Login Button */}
          <button
            type="submit"
            disabled={loading || demoLoading !== null}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#8948E5] hover:bg-[#7637d4] shadow-md shadow-[#8948E5]/20 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-2 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Login Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-xs font-bold text-slate-400 uppercase tracking-wider absolute">
            Or Quick Demo Login
          </span>
        </div>

        {/* Demo Login Buttons Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Demo Admin Button */}
          <button
            type="button"
            onClick={() => handleDemoLogin("admin")}
            disabled={loading || demoLoading !== null}
            className="py-3 px-3 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-1.5"
          >
            {demoLoading === "admin" ? (
              <div className="w-4 h-4 border-2 border-purple-700 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Shield className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Demo Admin</span>
              </>
            )}
          </button>

          {/* Demo User Button */}
          <button
            type="button"
            onClick={() => handleDemoLogin("user")}
            disabled={loading || demoLoading !== null}
            className="py-3 px-3 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-1.5"
          >
            {demoLoading === "user" ? (
              <div className="w-4 h-4 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <User className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Demo User</span>
              </>
            )}
          </button>
        </div>

        {/* Footer link to Signup */}
        <div className="text-center pt-2 text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-[#8948E5] hover:text-[#7637d4] transition-colors">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;