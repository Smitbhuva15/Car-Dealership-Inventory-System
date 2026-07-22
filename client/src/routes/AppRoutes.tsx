import { Routes, Route } from "react-router-dom";

import MainLayout from "../MainLayout"; 

import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Vehicles from "../pages/Vehicles";
import Profile from "../pages/Profile";
import AdminDashboard from "../pages/AdminDashboard";
import AddVehicle from "../pages/AddVehicle";
import EditVehicle from "../pages/EditVehicle";
import Unauthorized from "../pages/Unauthorized";
import Login from "../pages/Login";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Layout */}
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/vehicles"
          element={
            <PrivateRoute>
              <Vehicles />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/vehicles/add"
          element={
            <AdminRoute>
              <AddVehicle />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/vehicles/edit/:id"
          element={
            <AdminRoute>
              <EditVehicle />
            </AdminRoute>
          }
        />

        {/* Other Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;