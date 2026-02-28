import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Bell, LayoutDashboard, X } from 'lucide-react';
import authApi from '../../../api/authApi'; // ✅ ĐÃ THÊM DÒNG NÀY ĐỂ HẾT LỖI
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeBottomNav from './EmployeeBottomNav';

const EmployeeLayout = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // Trạng thái modal thông báo

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1. Gọi đúng tên hàm getMe() từ authApi
        const response = await authApi.getMe(); 
        
        // 2. Lấy dữ liệu và lưu vào State
        // Vì Backend trả về cục JSON bọc trong "data", ta bóc nó ra
        const actualData = response.data ? response.data : response;
        setData(actualData);

      } catch (error) {
        console.error("Lỗi lấy thông tin Profile:", error);
        // Tạm thời giữ mock data để không bị trắng trang nếu lỗi
        setData({ 
          employee: { name: "Nguyễn Văn Trường", position: "Cơ sở Thủy Lợi", avatar: "NT" },
          announcement: "Chào mừng bạn đến với hệ thống Hải Xồm HR." 
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
      case '/employee/dashboard': return 'Trang chủ';
      case '/employee/schedule': return 'Lịch làm việc';
      case '/employee/salary': return 'Lương';
      case '/employee/exchange': return 'Đổi ca';
      case '/employee/profile': return 'Hồ sơ cá nhân';
      default: return 'Nhân viên';
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
      <EmployeeSidebar userData={data?.employee} />
      
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOPBAR MOBILE - Cố định ở trên */}
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
  onClick={() => setIsNotificationOpen(true)} // Thêm dòng này
  className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
>
  <div className="relative">
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
  </div>
</button>

            <div 
              onClick={() => navigate('/employee/profile')}
              className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white shadow-sm"
            >
              {data?.employee?.avatar || "VA"}
            </div>
          </div>
        </header>

        {/* TOPBAR DESKTOP */}
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
      <EmployeeBottomNav />

      {/* MODAL THÔNG BÁO CHUNG */}
      {isNotificationOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity">
    {/* Lớp nền mờ phía sau */}
    <div 
      className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" 
      onClick={() => setIsNotificationOpen(false)}
    ></div>

    {/* Nội dung Modal */}
    <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
      {/* Header Modal */}
      <div className="flex items-center justify-between p-4 border-b border-slate-50">
        <h3 className="font-bold text-slate-800">Thông báo</h3>
        <button 
          onClick={() => setIsNotificationOpen(false)}
          className="p-1 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      {/* Body Modal */}
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

export default EmployeeLayout;