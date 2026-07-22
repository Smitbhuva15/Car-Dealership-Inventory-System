// AdminRoute.tsx
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = true; // Replace with your admin check

  return isAdmin ? children : <Navigate to="/unauthorized" />;
};

export default AdminRoute;