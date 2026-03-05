import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  DollarSign,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Phone,
  Mail,
} from "lucide-react";

const ManagerProfile = () => {
  const { data } = useOutletContext();
  const navigate = useNavigate();

  // Dữ liệu giả định dành riêng cho Quản lý nếu data từ context chưa có
  const displayData = data?.employee || {
    full_name: "Trần Quản Lý",
    employee_code: "MGR-LX001",
    status: "active",
    role: "Trưởng chi nhánh",
    branch_name: "Cơ sở Xã Đàn",
    type: "full",
    base_salary: 15000000,
    phonenumber: "0988.777.666",
    email: "quanly.haixom@gmail.com",
    avatar: "TQL",
    job_history: [
      {
        id: 1,
        branch_name: "Cơ sở Giải Phóng",
        position_name: "Giám sát tầng",
        start_date: "01/01/2024",
        end_date: "31/12/2025",
      },
      {
        id: 2,
        branch_name: "Cơ sở Xã Đàn",
        position_name: "Trưởng chi nhánh",
        start_date: "01/01/2026",
        end_date: null,
      }
    ]
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="max-w-5xl mx-auto md:pt-8 md:px-6 space-y-6 pb-24 md:pb-12 font-sans">
      {/* Banner & Avatar Section */}
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-sm overflow-hidden border border-slate-100 mx-4 md:mx-0 mt-5">
        <div className="h-40 md:h-52 bg-gradient-to-br from-[#6366F1] via-[#818CF8] to-[#C084FC] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-900/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

          <div className="absolute mt-10 w-full px-6 md:px-12">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5">
              <div className="text-center md:text-left pb-4 md:pb-6 flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                    {displayData.full_name}
                  </h2>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <div>
                    {displayData.status === "active" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Đang làm việc
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 text-[10px] font-black uppercase rounded-lg border border-rose-100 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                        {displayData.status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Mã Quản lý:</span>
                    <span className="text-[11px] font-black text-indigo-600 uppercase">{displayData.employee_code}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Vai trò:</span>
                    <span className="text-[11px] font-black text-slate-700 uppercase">{displayData.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-10 md:h-4 bg-white"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] p-4 md:p-6 shadow-sm border border-slate-50">
            <h3 className="text-xs font-black text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-500" /> Thông tin nhân sự Quản lý
            </h3>

            <div className="space-y-1">
              <InfoRow
                icon={<MapPin size={18} className="text-purple-500" />}
                label="Cơ sở đang điều hành"
                value={displayData.branch?.name || displayData.branch_name || "Chưa cập nhật"}
                bgColor="bg-purple-50"
              />
              <div className="h-[1px] bg-slate-50 my-1 ml-14"></div>
              <InfoRow
                icon={<Calendar size={18} className="text-emerald-500" />}
                label="Loại hợp đồng"
                value={displayData.type === "full" ? "Chính thức (Full-time)" : "Bán thời gian"}
                bgColor="bg-emerald-50"
              />
              <div className="h-[1px] bg-slate-50 my-1 ml-14"></div>
              <InfoRow
                icon={<DollarSign size={18} className="text-amber-500" />}
                label="Mức lương trách nhiệm"
                value={displayData.base_salary ? `${Number(displayData.base_salary).toLocaleString()}đ` : "Chưa hiển thị"}
                bgColor="bg-amber-50"
              />
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 min-h-[150px]">
            <h3 className="text-xs font-black text-slate-800 mb-6 uppercase tracking-wider flex items-center gap-2">
              Lịch sử thăng tiến & Công tác
            </h3>

            {displayData.job_history && displayData.job_history.length > 0 ? (
              <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                {displayData.job_history.map((history, index) => (
                  <div key={history.id || index} className="relative">
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-indigo-500 shadow-sm"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                      <div>
                        <p className="text-sm font-black text-slate-800">
                          {history.branch?.name || history.branch_name || "Chi nhánh Hải Xồm"}
                        </p>
                        <p className="text-[11px] font-bold text-indigo-500 uppercase">
                          {history.position?.name || history.position_name || "Vị trí"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          {history.start_date} <span className="mx-1 text-slate-300">→</span> {history.end_date || "Hiện tại"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-slate-50 rounded-2xl">
                <p className="text-slate-400 text-xs font-bold italic">Chưa có dữ liệu thuyên chuyển</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50">
            <h3 className="text-xs font-black text-slate-800 mb-4 uppercase tracking-wider italic">Liên hệ quản trị</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                  <Phone size={14} />
                </div>
                <span className="text-sm font-bold text-slate-600">{displayData.phonenumber}</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                  <Mail size={14} />
                </div>
                <span className="text-sm font-bold text-slate-600 truncate">{displayData.email}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-white text-red-500 border border-red-50 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-red-50 active:scale-95 transition-all"
          >
            <LogOut size={18} /> Đăng xuất tài khoản
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value, bgColor }) => (
  <div className="flex items-center gap-4 p-3 hover:bg-slate-50/50 rounded-2xl transition-colors group">
    <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
    </div>
    <ChevronRight size={14} className="text-slate-300" />
  </div>
);

export default ManagerProfile;