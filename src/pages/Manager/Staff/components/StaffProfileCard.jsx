import React from "react";
import { User, Calendar, Phone, Clock, Edit3, FileText } from "lucide-react";

const StaffProfileCard = ({ staff }) => {
  if (!staff) return null;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 flex flex-col md:flex-row gap-8 items-start transition-all duration-300">
      {/* Khối Avatar (Trái) */}
      <div className="w-full md:w-48 h-64 bg-indigo-50 rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 relative group overflow-hidden">
        <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-3xl font-black text-white shadow-xl mb-4">
          {staff.avatar}
        </div>
        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Ảnh nhân sự</span>
        <button className="absolute inset-0 bg-indigo-600/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white font-bold text-xs uppercase">
          Thay ảnh
        </button>
      </div>

      {/* Khối Thông tin (Phải) */}
      <div className="flex-1 space-y-6 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{staff.name}</h2>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest mt-2 inline-block">
              {staff.role} • {staff.position}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-200 transition-all">
              <Clock size={14} /> Lịch sử chấm công
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black hover:shadow-lg transition-all">
              <Edit3 size={14} /> Chỉnh sửa
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-50">
          <InfoItem icon={<User size={16}/>} label="ID Nhân viên" value={staff.id} />
          <InfoItem icon={<Phone size={16}/>} label="Số điện thoại" value={staff.phone} />
          <InfoItem icon={<Calendar size={16}/>} label="Ngày gia nhập" value={staff.joinDate} />
<InfoItem 
  icon={<Clock size={16}/>} 
  label="Nghỉ cố định" 
  // Kiểm tra: Nếu có mảng busyDays và độ dài > 0 thì nối các ngày lại, ngược lại hiện "Chưa cập nhật"
  value={staff.busyDays && staff.busyDays.length > 0 
    ? staff.busyDays.join(", ") 
    : "Chưa cập nhật"
  } 
  color={staff.busyDays && staff.busyDays.length > 0 ? "text-slate-700" : "text-rose-500"} 
/>          <InfoItem icon={<FileText size={16}/>} label="Trạng thái" value={staff.status} />
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value, color = "text-slate-700" }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-slate-400">
      {icon} <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className={`text-sm font-bold ${color}`}>{value}</p>
  </div>
);

export default StaffProfileCard;