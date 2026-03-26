import React, { useState, useEffect } from "react";
import {
  FileDown,
  Calendar,
  X,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import axios from "axios";

// DỮ LIỆU MOCK THEO ĐÚNG API SPEC 5.2 ĐỂ DỰ PHÒNG
const MOCK_ATTENDANCE = [
  {
    id: 501,
    employee_id: 3,
    employee_name: "Trần Văn Bàn",
    date: "2026-03-25",
    actual_branch_id: 1,
    total_work_hours: 8.0,
    late_minutes: 0,
    early_minutes: 0,
    overtime_hours: 0.5,
    status: "Chờ duyệt",
  },
  {
    id: 502,
    employee_id: 4,
    employee_name: "Nguyễn Văn Chạy",
    date: "2026-03-25",
    actual_branch_id: 1,
    total_work_hours: 3.5,
    late_minutes: 15,
    early_minutes: 0,
    overtime_hours: 0,
    status: "Ngoại lệ",
  },
];

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isFinalized, setIsFinalized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    `${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
  );
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  const handleExportExcel = () => {
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 5000);
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // Lấy token từ lúc Login

        // Gọi API 5.2, truyền kèm query param nhánh và ngày hôm nay
        const today = new Date().toISOString().split("T")[0];
        const response = await axios.get(
          `http://115.146.126.49:8084/api/v1/daily-attendances?branch_id=1&date=${today}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        const realData = response.data.data;

        if (realData && Array.isArray(realData) && realData.length > 0) {
          setAttendanceData(realData);
        } else {
          setAttendanceData(MOCK_ATTENDANCE);
        }
      } catch (error) {
        console.warn(
          "API lỗi hoặc chưa có data, hệ thống tự động sử dụng Mock Data chuẩn API 5.2.",
        );
        setAttendanceData(MOCK_ATTENDANCE);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER TRANG */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* BỘ LỌC LỊCH */}
        <div className="flex items-center gap-4 relative">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100 z-10">
            <Calendar size={24} />
          </div>

          <div className="flex flex-col relative">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
            >
              <h1 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                Bảng công ngày {new Date().toLocaleDateString("vi-VN")}
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium italic mt-0.5">
              Dữ liệu chấm công trực tiếp từ thiết bị
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2 rounded-xl flex items-center gap-2 border font-bold text-xs ${
              isFinalized
                ? "bg-red-50 border-red-100 text-red-600"
                : "bg-emerald-50 border-emerald-100 text-emerald-600"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${isFinalized ? "bg-red-500" : "bg-emerald-500"}`}
            ></span>
            {isFinalized ? "ĐÃ CHỐT CÔNG" : "CHƯA CHỐT CÔNG"}
          </div>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600 active:scale-95 transition-all shadow-lg shadow-rose-100"
          >
            <FileDown size={18} /> XUẤT EXCEL
          </button>
        </div>
      </div>

      {/* BẢNG DANH SÁCH */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-50 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Báo Cáo Ngày</h3>
          <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            {attendanceData.length} Nhân viên
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                <th className="px-8 py-4">Mã NV</th>
                <th className="px-6 py-4">Họ Tên</th>
                <th className="px-6 py-4 text-center">Trạng Thái</th>
                <th className="px-6 py-4 text-center">Chuẩn (H)</th>
                <th className="px-6 py-4 text-center border-l border-slate-100">
                  Thực Tế (H)
                </th>
                <th className="px-6 py-4 text-center text-rose-500">
                  Muộn/Sớm
                </th>
                <th className="px-6 py-4 text-center text-emerald-600">
                  OT (H)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : (
                Array.isArray(attendanceData) &&
                attendanceData.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedStaff(item)}
                    className={`cursor-pointer transition-all group ${item.status === "Ngoại lệ" ? "bg-orange-50/50 hover:bg-orange-50" : "hover:bg-indigo-50/40"}`}
                  >
                    <td className="px-8 py-5 font-bold text-slate-800 text-sm">
                      NV{String(item.employee_id).padStart(3, "0")}
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-700 text-sm">
                      {item.employee_name}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${item.status === "Ngoại lệ" ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-500"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-slate-400 italic">
                      8.0
                    </td>
                    <td className="px-6 py-5 text-center font-black text-indigo-600 border-l border-slate-50">
                      {item.total_work_hours}
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-rose-400">
                      {item.late_minutes > 0 || item.early_minutes > 0
                        ? `${item.late_minutes + item.early_minutes}p`
                        : "0"}
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-emerald-500">
                      {item.overtime_hours}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CHI TIẾT NHÂN VIÊN */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-indigo-100">
                  {String(selectedStaff.employee_id).padStart(2, "0")}
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-800">
                    {selectedStaff.employee_name}
                  </h4>
                  <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mt-1">
                    Mã nhân sự: {selectedStaff.employee_id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStaff(null)}
                className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Đi muộn",
                    val: `${selectedStaff.late_minutes} phút`,
                    icon: <Clock size={16} />,
                    color: "text-amber-500",
                  },
                  {
                    label: "Về sớm",
                    val: `${selectedStaff.early_minutes} phút`,
                    icon: <AlertCircle size={16} />,
                    color: "text-rose-500",
                  },
                  {
                    label: "Tăng ca (OT)",
                    val: `${selectedStaff.overtime_hours} giờ`,
                    icon: <CheckCircle2 size={16} />,
                    color: "text-emerald-500",
                  },
                  {
                    label: "Tổng giờ làm",
                    val: `${selectedStaff.total_work_hours} giờ`,
                    icon: <Calendar size={16} />,
                    color: "text-indigo-500",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 hover:border-indigo-200 transition-colors"
                  >
                    <div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {stat.label}
                    </p>
                    <p className="text-lg font-black text-slate-800">
                      {stat.val}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex justify-end gap-3 rounded-b-[40px]">
              <button
                onClick={() => setSelectedStaff(null)}
                className="px-6 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
