import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  CalendarDays,
  Wallet,
  Clock,
  AlertCircle,
  ChevronRight,
  ArrowDownToLine,
  Filter,
  Loader2,
} from "lucide-react";
import attendanceApi from "../../api/attendanceApi";

const EmployeeSalary = () => {
  // Lấy dữ liệu nhân viên từ Layout (dùng ID để gọi API chính xác)
  const context = useOutletContext();
  const contextData = context?.data;

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  // Thêm dòng này để quản lý Năm
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [salaryData, setSalaryData] = useState(null);

  // 1. DỮ LIỆU GIẢ LẬP (Sử dụng khi API Backend chưa có)
  const MOCK_SALARY_DATA = {
    summary: {
      estimatedSalary: "6.250.000", // final_salary từ bảng Payroll
      baseSalary: "5.500.000", // base_salary_amount
      allowance: "600.000", // allowance_amount
      bonus: "300.000", // Tính từ bảng SalaryBonus
      deduction: "150.000", // deduction_amount
      totalWorkDays: 22, // total_work_days
      overtimeHours: 10.5, // Tổng giờ từ DailyAttendance nơi có overtime
      lateCount: 2, // Đếm các dòng DailyAttendance có late_minutes > 0
      advanceAmount: "0", // Từ bảng CashAdvance
    },
    history: [
      {
        date: "22/05/2024",
        shift: "Ca sáng",
        checkIn: "07:58",
        checkOut: "12:05",
        status: "Đúng giờ",
      },
      {
        date: "21/05/2024",
        shift: "Ca chiều",
        checkIn: "13:10",
        checkOut: "18:00",
        status: "Muộn 10p",
      },
      {
        date: "20/05/2024",
        shift: "Ca sáng",
        checkIn: "08:00",
        checkOut: "12:00",
        status: "Đúng giờ",
      },
      {
        date: "19/05/2024",
        shift: "Ca chiều",
        checkIn: "13:00",
        checkOut: "18:05",
        status: "Đúng giờ",
      },
    ],
  };

  useEffect(() => {
    const fetchSalaryData = async () => {
      // Sử dụng contextData?.employee?.id khớp với bảng Employee (id)
      if (!contextData?.employee?.id) {
        setSalaryData(MOCK_SALARY_DATA);
        return;
      }

      setLoading(true);
      try {
        // API gọi bảng Payroll và DailyAttendance
        const response = await attendanceApi.getSalaryHistory(
          contextData.employee.id,
          selectedMonth,
          selectedYear, // Sử dụng state selectedYear
        );

        // LOGIC MAPPING: Chuyển đổi dữ liệu từ Database sang giao diện
        // --- PHẦN XỬ LÝ BACKEND ĐỂ CHỐNG LỖI GIAO DIỆN ---
        const payroll = response?.payroll || {}; // Phòng hờ nếu ko có object payroll
        const attendances = response?.attendances || []; // Luôn là mảng để .map ko lỗi

        const formattedData = {
          summary: {
            // Ép kiểu Number và dùng toLocaleString để hiện 6.000.000 thay vì 6000000
            estimatedSalary: Number(payroll.final_salary || 0).toLocaleString(
              "vi-VN",
            ),
            baseSalary: Number(payroll.base_salary_amount || 0).toLocaleString(
              "vi-VN",
            ),
            allowance: Number(payroll.allowance_amount || 0).toLocaleString(
              "vi-VN",
            ),

            // Thưởng và Ứng lương thường là tổng hợp từ mảng khác, nên để mặc định là 0
            bonus: Number(response?.total_bonus || 0).toLocaleString("vi-VN"),
            advanceAmount: Number(response?.total_advance || 0).toLocaleString(
              "vi-VN",
            ),

            // Khấu trừ (Deduction)
            deduction: Number(payroll.deduction_amount || 0).toLocaleString(
              "vi-VN",
            ),

            // Các chỉ số đếm (Số nguyên)
            totalWorkDays: Number(payroll.total_work_days || 0),
            overtimeHours: Number(response?.total_overtime || 0),

            // Logic đếm số lần đi muộn từ danh sách chấm công hằng ngày
            lateCount: attendances.filter(
              (att) => Number(att.late_minutes || 0) > 0,
            ).length,
          },
          // Ánh xạ từ bảng DailyAttendance
          // Ánh xạ danh sách chấm công
          history: attendances.map((att) => ({
            // Định dạng ngày: 2024-05-22 -> 22/05/2024
            date: att.date
              ? new Date(att.date).toLocaleDateString("vi-VN")
              : "---",
            shift: att.shift_name || "Chưa gán ca",
            checkIn: att.check_in_time || "--:--",
            checkOut: att.check_out_time || "--:--",
            // Hiển thị trạng thái dựa trên số phút muộn
            status:
              Number(att.late_minutes || 0) > 0
                ? `Muộn ${att.late_minutes}p`
                : att.check_in_time
                  ? "Đúng giờ"
                  : "Nghỉ",
          })),
        };

        setSalaryData(formattedData);
      } catch (error) {
        console.error("Lỗi kết nối CSDL:", error);
        setSalaryData(MOCK_SALARY_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, [selectedMonth, selectedYear, contextData?.employee?.id]);

  // Ưu tiên lấy data từ API, nếu null thì lấy từ Mock
  const displayData = salaryData?.summary || MOCK_SALARY_DATA.summary;
  const historyData = salaryData?.history || MOCK_SALARY_DATA.history || [];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 pb-24">
      {/* Header & Filter */}
      {/* Container chính: justify-between đảm bảo Header bên trái và Filter bên phải */}
      <div className="flex items-center justify-between gap-4 w-full mb-6">
        {/* Cột bên trái: Tiêu đề (Có thể để trống nhưng vẫn giữ div để giữ layout) */}
        <div className="hidden md:block">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            Bảng lương
            <span className="text-indigo-600 bg-indigo-50 px-4 py-1 rounded-2xl">
              Tháng {selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth}/
              {selectedYear}
            </span>
          </h2>{" "}
        </div>

        {/* Cột bên phải: Bộ lọc (Luôn nằm phải nhờ ml-auto trên mobile) */}
        <div className="ml-auto flex items-center gap-2 bg-white p-1.5 md:p-2 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all">
          <div className="flex items-center gap-2 px-2 border-r border-slate-100">
            <Filter size={16} className="text-indigo-500" />
            <span className="text-[11px] font-black text-slate-400 uppercase hidden sm:inline">
              Bộ lọc
            </span>
          </div>

          {/* Select Tháng */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1 < 10 ? `0${i + 1}` : i + 1}
              </option>
            ))}
          </select>

          {/* Select Năm - Cho phép xem ngược lại 3 năm trước */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer"
          >
            {[0, 1, 2, 3].map((item) => {
              const year = new Date().getFullYear() - item;
              return (
                <option key={year} value={year}>
                  Năm {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Tóm tắt lương - Gradient Tím Indigo */}
      <div className="bg-gradient-to-br from-[#6366F1] via-[#818CF8] to-[#A855F7] rounded-[2.5rem] p-6 md:p-10 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-900/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                <Wallet size={16} />
              </span>
              {/* Sửa lại phần text nhỏ phía trên số tiền thực lĩnh */}
              <p className="text-white/80 text-[10px] font-black uppercase tracking-widest">
                Thực lĩnh dự kiến (Tháng {selectedMonth}/{selectedYear})
              </p>
              {/* Đặt đoạn này cạnh Tiêu đề hoặc trong Card lương */}
              <span
                className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                  selectedMonth === new Date().getMonth() + 1 &&
                  selectedYear === new Date().getFullYear()
                    ? "bg-amber-100 text-amber-600" // Tháng hiện tại
                    : "bg-emerald-100 text-emerald-600" // Tháng đã qua
                }`}
              >
                {selectedMonth === new Date().getMonth() + 1 &&
                selectedYear === new Date().getFullYear()
                  ? "Đang tính toán"
                  : "Đã chốt lương"}
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black mb-6">
              {displayData.estimatedSalary}{" "}
              <span className="text-lg text-white/70 font-bold uppercase">
                vnđ
              </span>
            </h3>
            <button className="flex items-center gap-2 bg-white text-indigo-600 px-5 py-3 rounded-2xl text-xs font-black transition-all hover:shadow-lg active:scale-95 shadow-sm uppercase tracking-wider">
              <ArrowDownToLine size={16} /> Xuất phiếu lương
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SalaryStatItem label="Lương cứng" value={displayData.baseSalary} />
            <SalaryStatItem label="Phụ cấp" value={displayData.allowance} />
            <SalaryStatItem label="Thưởng/Tip" value={displayData.bonus} />
            <SalaryStatItem
              label="Khấu trừ"
              value={`-${displayData.deduction}`}
              isRed
            />
          </div>
        </div>
      </div>

      {/* Grid thống kê nhanh */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatSmall
          icon={<CalendarDays className="text-indigo-500" />}
          label="Tổng cộng"
          value={displayData.totalWorkDays}
          unit="ngày"
        />
        <StatSmall
          icon={<Clock className="text-emerald-500" />}
          label="Tăng ca"
          value={displayData.overtimeHours}
          unit="giờ"
        />
        <StatSmall
          icon={<AlertCircle className="text-rose-500" />}
          label="Đi muộn"
          value={displayData.lateCount}
          unit="lần"
        />
        <StatSmall
          icon={<Wallet className="text-amber-500" />}
          label="Ứng lương"
          value={displayData.advanceAmount}
          unit="đ"
        />
      </div>

      {/* Lịch sử chấm công (Table) */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-500" />
          </div>
        )}
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">
            Chi tiết chấm công
          </h3>
          <span className="text-[10px] bg-indigo-50 px-3 py-1 rounded-lg font-bold text-indigo-500 uppercase">
            Dữ liệu thực tế
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  Ngày
                </th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  Ca làm
                </th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  Vào/Ra
                </th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  Trạng thái
                </th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {historyData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-700">
                      {row.date}
                    </p>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-500">
                    {row.shift}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                        {row.checkIn}
                      </span>
                      <span className="text-slate-300">-</span>
                      <span className="text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                        {row.checkOut}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                        row.status.includes("Đúng giờ")
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-slate-300 group-hover:text-indigo-500 transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const SalaryStatItem = ({ label, value, isRed = false }) => (
  <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
    <p className="text-[10px] text-white/60 font-bold uppercase mb-1 tracking-tight">
      {label}
    </p>
    <p
      className={`text-sm font-black ${isRed ? "text-rose-200" : "text-white"}`}
    >
      {value}đ
    </p>
  </div>
);

const StatSmall = ({ icon, label, value, unit }) => (
  <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[15px] font-bold text-slate-400 uppercase leading-none mb-1.5 truncate">
        {label}
      </p>
      <p className="text-xl font-black text-slate-800 leading-none">
        {value}{" "}
        <span className="text-[10px] text-slate-400 font-bold">{unit}</span>
      </p>
    </div>
  </div>
);

export default EmployeeSalary;
