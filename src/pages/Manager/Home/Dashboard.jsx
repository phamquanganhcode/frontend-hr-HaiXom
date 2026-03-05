import React from "react";
import { 
  Users, 
  CalendarDays, 
  ArrowRight, 
  LayoutDashboard, 
  ClipboardCheck, 
  TrendingUp,
  AlertCircle
} from "lucide-react";

const Dashboard = () => {
  // Dữ liệu giả lập cho dashboard
  const stats = [
    { label: "Tổng nhân sự", value: "24", icon: <Users size={20} />, color: "bg-indigo-600", detail: "2 người mới tháng này" },
    { label: "Ca làm hôm nay", value: "8/8", icon: <ClipboardCheck size={20} />, color: "bg-emerald-500", detail: "Đã đủ quân số" },
    { label: "Doanh thu ngày", value: "12.5M", icon: <TrendingUp size={20} />, color: "bg-amber-500", detail: "+15% so với hôm qua" },
  ];

  const shortcuts = [
    { 
      title: "Quản lý nhân sự", 
      desc: "Xem hồ sơ, chỉnh sửa thông tin và lịch nghỉ cố định.",
      icon: <Users className="text-indigo-600" size={24} />,
      link: "/manager/staff",
      count: "Hoạt động"
    },
    { 
      title: "Xếp lịch làm việc", 
      desc: "Phân ca, chốt lịch tuần và điều chỉnh ca gãy.",
      icon: <CalendarDays className="text-emerald-600" size={24} />,
      link: "/manager/schedule",
      count: "Tuần 10"
    },
    { 
      title: "Báo cáo vận hành", 
      desc: "Thống kê công, hiệu suất làm việc của chi nhánh.",
      icon: <LayoutDashboard className="text-rose-600" size={24} />,
      link: "/manager/reports",
      count: "Cần xem"
    }
  ];

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen space-y-10 pb-20 font-sans animate-in fade-in duration-700">
      {/* Header Chào mừng */}
      

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Chỉ số nhanh (Stats) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-5">
              <div className={`${item.color} p-4 rounded-[1.5rem] text-white shadow-lg`}>
                {item.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                <p className="text-2xl font-black text-slate-800">{item.value}</p>
                <p className="text-[9px] font-bold text-slate-400 mt-1">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chức năng chính (Shortcuts) */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Chức năng quản lý</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shortcuts.map((card, idx) => (
              <button 
                key={idx}
                className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left relative overflow-hidden"
              >
                <div className="mb-6 p-4 bg-slate-50 w-fit rounded-2xl group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-2">{card.title}</h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">{card.desc}</p>
                
                <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                  <span className="px-3 py-1 bg-slate-100 text-[10px] font-black text-slate-500 rounded-lg uppercase">
                    {card.count}
                  </span>
                  <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                    Truy cập <ArrowRight size={16} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Thông báo quan trọng */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-200">
          <div className="flex items-center gap-6">
            <div className="bg-white/10 p-4 rounded-2xl text-amber-400 animate-pulse">
              <AlertCircle size={32} />
            </div>
            <div>
              <h4 className="text-lg font-black uppercase tracking-tight">Lịch tuần tới chưa được duyệt!</h4>
              <p className="text-slate-400 text-sm font-medium">Bạn có 24 giờ để chốt danh sách nhân sự cho tuần sau.</p>
            </div>
          </div>
          <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors shrink-0">
            Kiểm tra ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;