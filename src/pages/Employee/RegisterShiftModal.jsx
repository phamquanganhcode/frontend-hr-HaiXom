import React, { useState, useEffect, useMemo } from "react";
import { X, Check, Lock, Users, Loader2 } from "lucide-react";

// --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ---
const mockDays = [
  { label: "Thứ 2", date: "2026-03-09" },
  { label: "Thứ 3", date: "2026-03-10" },
  { label: "Thứ 4", date: "2026-03-11" },
  { label: "Thứ 5", date: "2026-03-12" },
  { label: "Thứ 6", date: "2026-03-13" },
  { label: "Thứ 7", date: "2026-03-14" },
  { label: "Chủ Nhật", date: "2026-03-15" },
];

const mockShiftTypes = [
  { id: "Sáng", time: "6:00-10:00" },
  { id: "Trưa", time: "10:00-14:00" },
  { id: "Chiều", time: "14:00-18:00" },
  { id: "Tối", time: "18:00-22:00" },
  { id: "Gãy", time: "10:15-21:00" },
];

const mockDemands = {
  "2026-03-09": {
    Sáng: { registered: 4, required: 5 },
    Chiều: { registered: 2, required: 4 },
  },
  "2026-03-10": {
    Sáng: { registered: 5, required: 5 },
    Chiều: { registered: 3, required: 4 },
  },
};

const mockFixedOff = {
  "2026-03-11": ["Sáng"],
};

const RegisterShiftModal = ({
  isOpen,
  onClose,
  userType = "part",
  weekRange,
  realShiftTypes = [],
  realDays = [],
  shiftDemands = {},
  fixedOffShifts = {},
  initialSelected = {},
  onSubmit,
}) => {
  // --- LOGIC FALLBACK: ƯU TIÊN REAL DATA, NẾU TRỐNG THÌ LẤY MOCK ---
  const displayDays = useMemo(() => (realDays.length > 0 ? realDays : mockDays), [realDays]);
  const displayShiftTypes = useMemo(() => (realShiftTypes.length > 0 ? realShiftTypes : mockShiftTypes), [realShiftTypes]);
  const displayDemands = useMemo(() => (Object.keys(shiftDemands).length > 0 ? shiftDemands : mockDemands), [shiftDemands]);
  const displayFixedOff = useMemo(() => (Object.keys(fixedOffShifts).length > 0 ? fixedOffShifts : mockFixedOff), [fixedOffShifts]);

  // --- STATES ---
  const [selectedShifts, setSelectedShifts] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const isFullTime = userType === "full";

  // Tự động reset lựa chọn khi Modal được mở/đóng
  useEffect(() => {
    if (isOpen) {
      // Nếu có dữ liệu cũ thì hiện lại, không thì mới để rỗng
    setSelectedShifts(initialSelected || {});
    setShowSuccessToast(false);
    }
  }, [isOpen, initialSelected]);

  const handleSendRegistration = () => {
    if (onSubmit) onSubmit(selectedShifts);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 2000);
  };

  const toggleShift = (date, shiftId) => {
    if (isFullTime) return;
    if (displayFixedOff[date]?.includes(shiftId)) return;

    setSelectedShifts((prev) => {
      const dayShifts = prev[date] || [];
      const isExist = dayShifts.includes(shiftId);
      const newDayShifts = isExist
        ? dayShifts.filter((id) => id !== shiftId)
        : [...dayShifts, shiftId];
      return { ...prev, [date]: newDayShifts };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/60 backdrop-blur-sm transition-all">
      {/* TOAST THÔNG BÁO THÀNH CÔNG */}
      {showSuccessToast && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center bg-white/10 backdrop-blur-[2px]">
          <div className="bg-slate-900 text-white px-8 py-5 rounded-3xl shadow-2xl flex flex-col items-center gap-3 animate-in zoom-in duration-300">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Check size={28} strokeWidth={4} />
            </div>
            <p className="font-black uppercase tracking-wide text-sm">Gửi đăng ký thành công!</p>
          </div>
        </div>
      )}

      {/* MODAL CONTAINER */}
      <div className="h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 relative">
        {/* HEADER */}
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Đăng ký nguyện vọng</h2>
              <p className="text-xs text-indigo-500 font-black mt-1 uppercase tracking-widest leading-none">
                {weekRange || "Chọn ca làm việc tuần tiếp theo"}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className={`flex-1 overflow-y-auto p-6 space-y-8 bg-[#fafafa] ${isFullTime ? "grayscale opacity-60 pointer-events-none" : ""}`}>
          {displayDays.map((day) => (
            <div key={day.date} className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-black text-slate-800 text-lg uppercase">{day.label}</h3>
                  <span className="text-slate-400 font-bold text-xs">{day.date}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {displayShiftTypes.map((shift) => {
                  const isSelected = selectedShifts[day.date]?.includes(shift.id);
                  const isFixedOff = displayFixedOff[day.date]?.includes(shift.id);
                  const demand = displayDemands[day.date]?.[shift.id];
                  const registered = demand?.registered ?? 0;
                  const required = demand?.required ?? 0;
                  const isFull = registered >= required && required > 0;

                  return (
                    <button
                      key={shift.id}
                      disabled={isFixedOff}
                      onClick={() => toggleShift(day.date, shift.id)}
                      className={`group relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center min-h-[85px]
                        ${isFixedOff 
                          ? "bg-slate-800 border-slate-800 text-slate-400 cursor-not-allowed shadow-none" 
                          : isSelected 
                            ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                            : "border-white bg-white text-slate-600 shadow-sm hover:border-slate-100"
                        } ${shift.id === "Gãy" ? "col-span-2" : ""}`}
                    >
                      {/* Badge Định mức */}
                      {!isFixedOff && (
                        <div className={`absolute -top-2 right-2 px-2 py-0.5 rounded-lg text-[9px] font-black flex items-center gap-1 shadow-sm transition-colors
                          ${isSelected ? "bg-white text-indigo-600" : isFull ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"}`}>
                          <Users size={10} />
                          <span>{registered}/{required}</span>
                        </div>
                      )}

                      {isFixedOff ? (
                        <>
                          <Lock size={16} className="text-slate-500 mb-1" />
                          <span className="text-[10px] font-black uppercase italic opacity-50">Ca {shift.id}</span>
                          <span className="text-[9px] font-bold mt-1 opacity-60 text-slate-400">{shift.time}</span>
                        </>
                      ) : (
                        <>
                          {isFull && !isSelected && (
                            <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                          )}
                          <span className="text-xs font-black uppercase">Ca {shift.id}</span>
                          <span className={`text-[9px] font-bold mt-1 opacity-60 ${isSelected ? "text-white" : "text-slate-400"}`}>
                            {shift.time}
                          </span>
                        </>
                      )}

                      {isSelected && !isFixedOff && (
                        <div className="absolute bottom-1 right-2">
                          <Check size={16} strokeWidth={4} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        {!isFullTime && displayDays.length > 0 && (
          <div className="p-6 border-t bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            <button
              disabled={Object.values(selectedShifts).every((arr) => arr.length === 0) || showSuccessToast}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black py-4 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 active:scale-95"
              onClick={handleSendRegistration}
            >
              {showSuccessToast ? <Loader2 className="animate-spin" size={20} /> : "XÁC NHẬN ĐĂNG KÝ"}
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-3 font-bold uppercase tracking-tight">
              Dữ liệu sẽ được gửi trực tiếp đến hệ thống quản lý
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterShiftModal;