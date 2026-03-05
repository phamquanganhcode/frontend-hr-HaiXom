import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Bell, LayoutDashboard, X } from 'lucide-react';
import authApi from '../../../api/authApi';
import ManagerSidebar from './ManagerSidebar';
import ManagerBottomNav from './ManagerBottomNav';

const ManagerLayout = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await authApi.getMe(); 
        const actualData = response.data ? response.data : response;
        setData(actualData);
      } catch (error) {
        console.error("Lỗi lấy thông tin Profile Manager:", error);
        // Mock data chuẩn cấu trúc userData?.branch?.name
        setData({ 
          employee: { 
            full_name: "Trần Quản Lý", 
            avatar: "TQL",
            branch: {
              name: "Cơ sở Xã Đàn"
            }
          },
          announcement: "Hôm nay có 2 yêu cầu xếp ca mới cần duyệt." 
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    switch(location.pathname) {
      case '/manager/dashboard': return 'Trang chủ';
      case '/manager/staff': return 'Quản lý nhân sự';
      case '/manager/scheduling': return 'Xếp ca làm việc';
      case '/manager/profile': return 'Hồ sơ cá nhân';
      default: return 'Quản lý';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col md:flex-row font-sans">
      {/* SIDEBAR DESKTOP */}
      <ManagerSidebar userData={data?.employee} />
      
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOPBAR MOBILE - Cố định ở trên (Giữ nguyên giao diện NV) */}
        <header className="md:hidden bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-800 leading-none">{getPageTitle()}</h1>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">
                {currentTime.toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsNotificationOpen(true)}
              className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <div className="relative">
                <Bell size={22} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
              </div>
            </button>

            <div 
              onClick={() => navigate('/manager/profile')}
              className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white shadow-sm cursor-pointer"
            >
              {data?.employee?.avatar || "QL"}
            </div>
          </div>
        </header>

        {/* TOPBAR DESKTOP (Giữ nguyên giao diện NV) */}
        <header className="hidden md:flex bg-white border-b p-4 px-8 justify-between items-center sticky top-0 z-30">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{getPageTitle()}</h2>
            <p className="text-xs text-slate-400 font-medium italic">Chào mừng trở lại, {data?.employee?.full_name}!</p>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="text-right border-r pr-6 border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                </p>
                <p className="text-lg font-black text-indigo-600 leading-none mt-1">
                  {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </p>
             </div>
             <button 
                onClick={() => setIsNotificationOpen(true)}
                className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
             >
                <Bell size={22} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
             </button>
          </div>
        </header>

        {/* NỘI DUNG TRANG CHÍNH */}
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ data, currentTime }} />
        </main>
      </div>

      {/* BOTTOM NAV MOBILE */}
      <ManagerBottomNav />

      {/* MODAL THÔNG BÁO (Giữ nguyên giao diện NV) */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsNotificationOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-50">
              <h3 className="font-bold text-slate-800">Thông báo quản lý</h3>
              <button onClick={() => setIsNotificationOpen(false)} className="p-1 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-10 flex flex-col items-center justify-center text-center">
              <p className="text-slate-400 text-sm font-medium">
                {data?.announcement ? data.announcement : "Không có thông báo mới"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerLayout;