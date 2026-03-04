import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  Info,
  Loader2,
  Lock,
  CheckCircle2,
} from "lucide-react";
import attendanceApi from "../../api/attendanceApi";
import RegisterShiftModal from "./RegisterShiftModal";
import authApi from "../../api/authApi";

const EmployeeSchedule = () => {
  const [userType, setUserType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFullTimeWarning, setShowFullTimeWarning] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [loading, setLoading] = useState(true); // Mặc định loading khi mới vào trang
  const [scheduleData, setScheduleData] = useState([]);

  // --- MOCK DATA (Dữ liệu giả lập) ---
  const mockSchedule = [
    { date: "2026-03-02", shiftName: "Ca Sáng", time: "08:00 - 14:00", location: "Quầy Bar" },
    { date: "2026-03-02", shiftName: "Ca Tối", time: "18:00 - 22:00", location: "Khu vực A" },
    { date: "2026-03-04", shiftName: "Ca Gãy", time: "10:00 - 14:00 & 17:00 - 21:00", location: "Sảnh chính" },
    { date: "2026-03-06", shiftName: "Ca Chiều", time: "14:00 - 22:00", location: "Kho" },
  ];
  // --- 1. LẤY THÔNG TIN USER KHI LOAD TRANG ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authApi.getProfile(); 
        const role = response?.data?.role || 'part';
        setUserType(role);
      } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
        console.warn("Sử dụng User giả lập (Part-time)");
        setUserType("part"); 
      }
    };
    fetchUserProfile();
  }, []);

  // --- 2. LẤY LỊCH LÀM VIỆC THEO TUẦN ---
  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      setScheduleData([]);
      try {
        // Dùng định dạng local YYYY-MM-DD sẽ an toàn hơn.
        const dateString = currentWeek.toLocaleDateString('en-CA'); 
        const response = await attendanceApi.getWeeklySchedule(dateString);
        // CẬP NHẬT: Chỉ set dữ liệu nếu API trả về mảng, nếu không set mảng rỗng
        setScheduleData(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Lỗi lấy lịch làm việc:", error);
        console.warn("Không lấy được API, sử dụng Mock Data");
        setScheduleData(mockSchedule);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [currentWeek]);
// 1. Tạo state để giữ dữ liệu đã đăng ký lần 1
const [previouslyRegistered, setPreviouslyRegistered] = useState({});

// 2. Fetch dữ liệu này khi currentWeek thay đổi
useEffect(() => {
  const fetchMyRegistrations = async () => {
    try {
      // Giả sử có API lấy nguyện vọng đã gửi
      const response = await attendanceApi.getMyRegistrations(currentWeek); 
      setPreviouslyRegistered(response); // format: { "date": ["shiftId1", "shiftId2"] }
    } catch {
      console.log("Chưa có dữ liệu đăng ký cũ");
    }
  };
  fetchMyRegistrations();
}, [currentWeek]);
  // --- 3. LOGIC TÍNH TOÁN---
  const getDaysInWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    return [...Array(7)].map((_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const weekDays = useMemo(() => getDaysInWeek(currentWeek), [currentWeek]);
const totalWeeklyHours = useMemo(() => {
  let totalMinutes = 0;
  
  // Tạo danh sách các chuỗi ngày YYYY-MM-DD của tuần hiện tại để đối chiếu
  const currentWeekDateStrings = weekDays.map(d => d.toLocaleDateString('en-CA'));

  scheduleData.forEach((shift) => {
    // CHỈ TÍNH nếu ngày của shift nằm trong tuần đang xem
    if (!shift.time || !currentWeekDateStrings.includes(shift.date)) return;

    const segments = shift.time.split("&");
    segments.forEach((seg) => {
      const times = seg.trim().split("-");
      if (times.length === 2) {
        const [start, end] = times.map((t) => t.trim());
        const [startH, startM] = start.split(":").map(Number);
        const [endH, endM] = end.split(":").map(Number);
        let duration = endH * 60 + endM - (startH * 60 + startM);
        if (duration < 0) duration += 24 * 60;
        totalMinutes += duration;
      }
    });
  });
  return (totalMinutes / 60).toFixed(1);
}, [scheduleData, weekDays]); // Thêm weekDays vào dependency

  const handleRegisterClick = () => {
    if (!userType) return;
    if (userType === "full") {
      setShowFullTimeWarning(true);
      setTimeout(() => setShowFullTimeWarning(false), 3000);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 pb-24 text-left relative">
      
      {/* WARNING POPUP */}
      {showFullTimeWarning && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in duration-300 max-w-xs text-center border-b-4 border-amber-500">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <Lock size={32} className="text-amber-600" />
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-black text-slate-800 uppercase">Thông báo hệ thống</h4>
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase">
                Tài khoản <span className="text-amber-600">Full-time</span> không cần đăng ký ca.
              </p>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-amber-500 animate-out slide-out-to-left fill-mode-forwards duration-[3000ms]" />
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Lịch làm việc</h1>
          <p className="text-slate-500 text-sm font-medium">Theo dõi thời gian biểu cá nhân</p>
        </div>

        <button
          onClick={handleRegisterClick}
          disabled={!userType || loading}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all shadow-sm flex items-center gap-2 active:scale-95 border-2
            ${!userType ? "bg-slate-50 border-slate-200 text-slate-300" : "bg-white border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"}`}
        >
          {!userType ? <Loader2 size={16} className="animate-spin" /> : <CalendarIcon size={16} />}
          ĐĂNG KÝ CA TUẦN SAU
        </button>
      </div>

      {/* WEEK NAVIGATION */}
      <div className="flex items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button onClick={() => { const d = new Date(currentWeek); d.setDate(d.getDate() - 7); setCurrentWeek(d); }} className="p-2 hover:bg-white rounded-lg transition-all"><ChevronLeft size={20} /></button>
          <div className="px-4 text-sm font-black text-slate-700 uppercase">
            {weekDays[0].getDate()}/{weekDays[0].getMonth() + 1} - {weekDays[6].getDate()}/{weekDays[6].getMonth() + 1}
          </div>
          <button onClick={() => { const d = new Date(currentWeek); d.setDate(d.getDate() + 7); setCurrentWeek(d); }} className="p-2 hover:bg-white rounded-lg transition-all"><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* SCHEDULE TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-500" />
          </div>
        )}

        <div className="divide-y divide-slate-50">
          {weekDays.map((day, idx) => {
            const dateStr = day.toISOString().split("T")[0];
            const shifts = scheduleData.filter((s) => s.date === dateStr);
            const isToday = new Date().toDateString() === day.toDateString();

            return (
              <div key={idx} className={`flex flex-col md:flex-row min-h-[100px] transition-colors ${isToday ? "bg-indigo-50/30" : "hover:bg-slate-50/50"}`}>
                <div className="w-full md:w-32 p-4 flex md:flex-col items-center justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-50 bg-slate-50/30 font-black">
                   <span className={`text-[10px] uppercase ${isToday ? "text-indigo-600" : "text-slate-400"}`}>{day.toLocaleDateString("vi-VN", { weekday: "short" })}</span>
                   <span className={`text-2xl ${isToday ? "text-indigo-600" : "text-slate-700"}`}>{day.getDate()}</span>
                </div>
                <div className="flex-1 p-4">
                  {shifts.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {shifts.map((shift, sIdx) => (
                        <div key={sIdx} className="bg-white border border-slate-100 p-4 rounded-[1.5rem] shadow-sm flex items-start gap-4">
                          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0"><Clock size={20} /></div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2"><h4 className="font-black text-slate-800 uppercase text-sm">{shift.shiftName}</h4><CheckCircle2 size={14} className="text-emerald-500" /></div>
                            <p className="text-xs font-bold text-indigo-600">{shift.time}</p>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium"><MapPin size={12} className="text-rose-400" />{shift.location}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center"><p className="text-xs font-bold text-slate-200 italic uppercase">Nghỉ</p></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-lg shadow-indigo-100">
          <CalendarIcon className="mb-3 opacity-50" size={24} />
          <p className="text-[10px] font-black uppercase opacity-70">Tổng giờ dự kiến</p>
          <p className="text-2xl font-black">{totalWeeklyHours} Giờ / Tuần</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-[2rem] text-white shadow-lg md:col-span-2 flex items-center">
          <p className="text-sm font-medium text-slate-300">
            {totalWeeklyHours > 0 ? "Vui lòng có mặt đúng giờ để check-in vân tay." : "Hiện chưa có lịch phân công cho tuần này."}
          </p>
        </div>
      </div>

      {/* MODAL ĐĂNG KÝ (Sử dụng dữ liệu thật) */}
      {userType && (
        <RegisterShiftModal
          isOpen={isModalOpen}
          initialSelected={previouslyRegistered}
          onClose={() => setIsModalOpen(false)}
          userType={userType}
          weekRange={`${weekDays[0].toLocaleDateString('vi-VN')} - ${weekDays[6].toLocaleDateString('vi-VN')}`}
          // Khi API thật sẵn sàng, bạn có thể fetch thêm dữ liệu Demand/FixedOff tại đây
        />
      )}
    </div>
  );
};

export default EmployeeSchedule;