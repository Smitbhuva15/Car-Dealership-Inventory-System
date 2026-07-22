import { Car } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-8 mt-auto text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Car className="w-5 h-5 text-[#8948E5]" />
          <span className="font-bold text-slate-900">AutoVault Dealership</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="flex space-x-6 text-xs text-slate-500 font-medium">
          <span className="hover:text-[#8948E5] cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-[#8948E5] cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-[#8948E5] cursor-pointer transition-colors">Contact Support</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
