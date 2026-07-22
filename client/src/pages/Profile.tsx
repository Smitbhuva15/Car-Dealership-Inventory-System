import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900">User Profile</h1>
      <div className="space-y-4 text-slate-700">
        <div className="pb-3 border-b border-slate-100">
          <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block">Full Name</span>
          <span className="text-lg font-semibold text-slate-900">{user?.name || "N/A"}</span>
        </div>
        <div className="pb-3 border-b border-slate-100">
          <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block">Email Address</span>
          <span className="text-lg font-semibold text-slate-900">{user?.email || "N/A"}</span>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block">Role</span>
          <span className="inline-block mt-1 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[#8948E5]/10 text-[#8948E5] border border-[#8948E5]/20">
            {user?.role || "user"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile; Profile