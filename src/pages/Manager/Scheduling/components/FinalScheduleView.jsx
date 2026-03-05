import React, { useEffect } from "react";
import {
  CheckCircle2,
  Download,
  Share2,
  Info,
} from "lucide-react";

const FinalScheduleView = ({ realData }) => {
  useEffect(() => {
    // Tự động cuộn lên đầu trang khi vừa hiển thị
    window.scrollTo(0, 0);
  }, []);
  // 1. CHI TIẾT NHÂN SỰ (Đã cập nhật đầy đủ danh sách)
  const staffDetails = {
    An: { fullName: "Nguyễn Bình An", role: "Trưởng ca", position: "Bếp chính" },
    Bình: { fullName: "Lê Văn Bình", role: "Nhân viên", position: "Phục vụ" },
    Chi: { fullName: "Hoàng Yến Chi", role: "Part-time", position: "Thu ngân" },
    Dũng: { fullName: "Phạm Anh Dũng", role: "Nhân viên", position: "Tiếp thực" },
    Hoa: { fullName: "Trương Quỳnh Hoa", role: "Part-time", position: "Lễ tân" },
    Nam: { fullName: "Nguyễn Hải Nam", role: "Nhân viên", position: "Pha chế" },
    Lan: { fullName: "Đặng Ngọc Lan", role: "Nhân viên", position: "Thu ngân" },
    Huệ: { fullName: "Lý Minh Huệ", role: "Nhân viên", position: "Phục vụ" },
    Linh: { fullName: "Mai Diệu Linh", role: "Part-time", position: "Phục vụ" },
    Hùng: { fullName: "Trần Mạnh Hùng", role: "Nhân viên", position: "Bảo vệ" },
    Khánh: { fullName: "Đỗ Duy Khánh", role: "Nhân viên", position: "Phụ bếp" },
    Tuấn: { fullName: "Ngô Anh Tuấn", role: "Full-time", position: "Bếp chính" },
  };

  // 2. DỮ LIỆU GIẢ LẬP ĐÃ LẤP ĐẦY 5 CA (Đảm bảo mỗi ca >= 2 người để hiện "Đủ người")
  const defaultSchedule = {
    "Thứ 2": { "Ca Sáng": ["An", "Bình"], "Ca Trưa": ["Chi", "Dũng"], "Ca Chiều": ["Hoa", "Nam"], "Ca Tối": ["Bình", "Linh"], "Ca Gãy": ["Tuấn", "Khánh"] },
    "Thứ 3": { "Ca Sáng": ["Lan", "Huệ"], "Ca Trưa": ["Tuấn", "Hùng"], "Ca Chiều": ["An", "Bình"], "Ca Tối": ["Lan", "Hoa"], "Ca Gãy": ["Khánh", "Nam"] },
    "Thứ 4": { "Ca Sáng": ["An", "Bình"], "Ca Trưa": ["Chi", "Dũng"], "Ca Chiều": ["Tuấn", "Lan"], "Ca Tối": ["Bình", "Hùng"], "Ca Gãy": ["Nam", "Hoa"] },
    "Thứ 5": { "Ca Sáng": ["Hùng", "Khánh"], "Ca Trưa": ["Chi", "An"], "Ca Chiều": ["Nam", "Hoa"], "Ca Tối": ["Hoa", "Linh"], "Ca Gãy": ["Dũng", "Bình"] },
    "Thứ 6": { "Ca Sáng": ["An", "Bình"], "Ca Trưa": ["Dũng", "Tuấn"], "Ca Chiều": ["Chi", "Linh"], "Ca Tối": ["Bình", "Nam"], "Ca Gãy": ["Huệ", "Lan"] },
    "Thứ 7": { "Ca Sáng": ["An", "Lan"], "Ca Trưa": ["Chi", "Hoa"], "Ca Chiều": ["Lan", "Huệ"], "Ca Tối": ["Tuấn", "Bình"], "Ca Gãy": ["Hùng", "Dũng"] },
    "CN": { "Ca Sáng": ["Bình", "Hùng"], "Ca Trưa": ["Dũng", "Lan"], "Ca Chiều": ["Khánh", "Hoa"], "Ca Tối": ["Hoa", "An"], "Ca Gãy": ["Linh", "Tuấn"] },
  };

  const scheduleData = (realData && Object.keys(realData).length > 0) ? realData : defaultSchedule;
  const quota = 2; 

  const days = [
    { label: "Thứ 2", date: "02/03" },
    { label: "Thứ 3", date: "03/03" },
    { label: "Thứ 4", date: "04/03" },
    { label: "Thứ 5", date: "05/03" },
    { label: "Thứ 6", date: "06/03" },
    { label: "Thứ 7", date: "07/03" },
    { label: "CN", date: "08/03" },
  ];

  const shifts = ["Ca Sáng", "Ca Trưa", "Ca Chiều", "Ca Tối", "Ca Gãy"];

  return (
    <div className="animate-in zoom-in duration-500 space-y-8 pb-10">
      {/* Banner Thành công */}
      <div className="bg-emerald-600 text-white p-8 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/30">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-black mb-1 italic uppercase tracking-tighter">Phát hành hoàn tất!</h2>
          <p className="text-emerald-50 font-medium text-xs opacity-90 uppercase tracking-widest">Toàn bộ nhân viên đã nhận được thông báo ca làm việc</p>
        </div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 px-2 p-6">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center lg:items-start">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight text-center lg:text-left">Lịch làm việc tuần sau</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center lg:text-left">Hiệu lực: 02/03 - 08/03/2026</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl text-xs font-black hover:bg-slate-100 transition-all border border-slate-100 uppercase tracking-widest">
              <Download size={16} /> Xuất PDF
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest">
              <Share2 size={16} /> Chia sẻ
            </button>
          </div>
        </div>

        {/* Bảng Lịch làm việc */}
        <div className="overflow-x-auto overflow-y-visible scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="table table-hover w-full border-separate border-spacing-0 table-auto lg:table-fixed">
            <thead>
              <tr>
                <th className="p-6 font-black text-slate-700 text-xs border-b border-slate-100 bg-white sticky left-0 z-20 shadow-[4px_0_10px_rgba(0,0,0,0.02)]">Ca làm việc</th>
                {days.map((day) => (
                  <th key={day.label} className="p-4 bg-slate-50 border-b border-slate-200/50 min-w-[160px] lg:min-w-0">
                    <span className="block text-xs font-black text-slate-700">{day.label}</span>
                    <span className="text-[10px] text-slate-400 font-bold mt-1 block uppercase tracking-tighter">{day.date}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr key={shift} className="group">
                  <td className="p-4 border-b border-r border-slate-50 font-black text-[11px] text-indigo-600 bg-white sticky left-0 z-20 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
                    {shift}
                  </td>
                  {days.map((day, idx) => {
                    const staffList = scheduleData[day.label]?.[shift] || [];
                    const isFull = staffList.length >= quota;
                    const isSunday = day.label === "CN";

                    return (
                      <td key={idx} className="p-3 border-b border-slate-100 vertical-top">
                        <div className={`min-h-[140px] flex flex-col justify-between p-3 rounded-2xl border transition-all ${isFull ? "bg-emerald-50/30 border-emerald-100 shadow-sm shadow-emerald-50" : "bg-slate-50 border-slate-100"}`}>
                          <div className="flex flex-col gap-1.5">
                            {staffList.map((name, sIdx) => {
                              const info = staffDetails[name] || { fullName: name, role: "N/A", position: "N/A" };
                              const tooltipClasses = isSunday ? "right-full mr-3 top-0" : "left-full ml-3 top-0";
                              
                              return (
                                <div key={sIdx} className="relative group/staff">
                                  <div className="flex items-center gap-2 px-2 py-2 bg-white rounded-xl shadow-sm border border-slate-100 cursor-help hover:border-indigo-400 transition-all">
                                    <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-black text-white">
                                      {name.charAt(0)}
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-700">{name}</span>
                                  </div>

                                  {/* Tooltip Thông minh */}
                                  <div className={`absolute z-[100] w-48 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl opacity-0 invisible group-hover/staff:opacity-100 group-hover/staff:visible transition-all duration-200 pointer-events-none border border-white/10 ${tooltipClasses}`}>
                                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                                      <div className="p-1.5 bg-indigo-500 rounded-lg"><Info size={12} /></div>
                                      <p className="text-[10px] font-black uppercase tracking-tighter">Thông tin chi tiết</p>
                                    </div>
                                    <p className="text-[11px] font-black text-indigo-400 mb-1">{info.fullName}</p>
                                    <p className="text-[10px] text-slate-400 font-bold mb-0.5">Vai trò: <span className="text-white">{info.role}</span></p>
                                    <p className="text-[10px] text-slate-400 font-bold">Vị trí: <span className="text-white">{info.position}</span></p>
                                    <div className={`absolute top-4 w-2 h-2 bg-slate-900 rotate-45 ${isSunday ? "-right-1" : "-left-1"}`}></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className={`mt-4 flex items-center justify-between border-t pt-2 ${isFull ? 'border-emerald-100' : 'border-slate-100'}`}>
                            <span className={`text-[9px] font-black uppercase ${isFull ? "text-emerald-500" : "text-slate-400"}`}>
                              {isFull ? "Đủ người" : "Thiếu người"}
                            </span>
                            <div className={`px-2 py-0.5 text-[10px] font-black rounded-md ${isFull ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                              {staffList.length} / {quota}
                            </div>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinalScheduleView;