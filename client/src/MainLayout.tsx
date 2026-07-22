import { Outlet } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#8948E5] selection:text-white">
      {/* Reusable Navbar */}
      <Navbar />

      {/* Main Body Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Reusable Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;