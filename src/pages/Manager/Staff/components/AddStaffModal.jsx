import React, { useState } from "react";
import { X, UserPlus, Check } from "lucide-react";

const AddStaffModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "Nhân viên",
    position: "Phục vụ",
    phone: "",
    status: "Đang làm việc"
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStaff = {
      ...formData,
      id: `NV${Math.floor(1000 + Math.random() * 9000)}`,
      avatar: formData.name.charAt(0).toUpperCase(),
      joinDate: new Date().toLocaleDateString("vi-VN"),
      busyDays: []
    };
    onAdd(newStaff);
    onClose();
    setFormData({ name: "", role: "Nhân viên", position: "Phục vụ", phone: "", status: "Đang làm việc" });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-indigo-50/50 rounded-t-[2.5rem]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white"><UserPlus size={20} /></div>
            <h3 className="font-black text-slate-800 uppercase tracking-tighter">Thêm nhân sự mới</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full"><X size={20} className="text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Họ và tên</label>
            <input required className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-indigo-500" placeholder="Họ và tên" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Vai trò</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option>Trưởng chi nhánh</option><option>Nhân viên</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Hợp đồng</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option>Full-time</option><option>Part-time</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Vị trí</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})}>
                <option>Bếp chính</option><option>Phục vụ</option><option>Thu ngân</option><option>Pha chế</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Cơ sở làm việc</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option>Bia Hải Xồm - Trung Hòa</option>
                <option>Bia Hải Xồm - Kim Liên</option>
                <option>Bia Hải Xồm - Hà Đông</option>
                <option>Bia Hải Xồm - Phạm Ngọc Thạch</option>
                <option>Bia Hải Xồm - Long Biên</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Số điện thoại</label>
            <input required className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none" placeholder="Số điện thoại" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            <Check size={18} /> Lưu hồ sơ
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;