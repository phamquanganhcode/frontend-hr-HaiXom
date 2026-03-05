import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, UserCircle } from 'lucide-react'; // Đã xóa chữ Days

const ManagerSidebar = ({ userData }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Menu dành riêng cho Manager
  const menuItems = [
    { icon: <LayoutDashboard size={18}/>, label: "Trang chủ", path: "/manager/dashboard" },
    { icon: <Users size={18}/>, label: "Quản lý nhân sự", path: "/manager/staff" },
    { icon: <Calendar size={18}/>, label: "Xếp ca làm việc", path: "/manager/scheduling" },
    { icon: <UserCircle size={18}/>, label: "Hồ sơ cá nhân", path: "/manager/profile" },
  ];

  return (
    <aside className="hidden md:flex w-72 bg-white border-r flex-col p-5 sticky top-0 h-screen">
      {/* Giữ nguyên Logo Indigo giống nhân viên */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
          <LayoutDashboard size={24} />
        </div>
        <div>
          <h1 className="text-lg font-black text-slate-800 leading-none">Hải Xồm HR</h1>
          <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Manager Panel</p>
        </div>
      </div>

      {/* User Info Card - Giữ nguyên style Indigo */}
      <div className="bg-indigo-50/50 rounded-2xl p-4 mb-6 flex items-center gap-3 border border-indigo-50">
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs relative shrink-0">
          {userData?.avatar || (userData?.full_name ? userData.full_name.split(' ').slice(-1)[0][0] : "QL")}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xs font-bold text-slate-800 truncate">
            {userData?.full_name || "Đang tải..."}
          </h2>
          <p className="text-[9px] text-slate-400 truncate uppercase font-semibold">
            {userData?.branch?.name || "Trưởng chi nhánh"}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-1">
        {menuItems.map((item) => (
          <div 
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-200
              ${location.pathname === item.path 
                ? 'bg-indigo-50 text-indigo-600 font-bold' 
                : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {item.icon}
            <span className="text-xs tracking-tight">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="pt-4 border-t border-slate-50 text-center">
        <p className="text-[9px] text-slate-300 font-medium">© 2026 Manager System</p>
      </div>
    </aside>
  );
};

export default ManagerSidebar;