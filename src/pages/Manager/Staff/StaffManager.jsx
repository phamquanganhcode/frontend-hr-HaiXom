import React, { useState } from "react";
import StaffProfileCard from "./components/StaffProfileCard";
import StaffTable from "./components/StaffTable";
import AddStaffModal from "./components/AddStaffModal";
import { UserPlus } from "lucide-react";

const StaffManager = () => {
  // KHAI BÁO DỮ LIỆU TRỰC TIẾP TẠI ĐÂY
  const [staffList, setStaffList] = useState([
    { id: "NV0001", name: "Nguyễn Bình An", role: "Trưởng ca", position: "Bếp chính", phone: "0901234567", joinDate: "15/01/2024", status: "Đang làm việc", avatar: "A", busyDays: ["Thứ 2", "CN"] },
    { id: "NV0002", name: "Lê Văn Thịnh Vượng", role: "Nhân viên", position: "Phục vụ", phone: "0902345678", joinDate: "20/02/2024", status: "Đang làm việc", avatar: "V", busyDays: [] },
    { id: "NV0003", name: "Nguyễn Hạnh Phúc", role: "Nhân viên", position: "Thu ngân", phone: "0901234123", joinDate: "10/01/2024", status: "Đang làm việc", avatar: "P", busyDays: ["Thứ 2"] },
    { id: "NV0004", name: "Nguyễn Như Ý", role: "Nhân viên", position: "Chạy bàn", phone: "0901234999", joinDate: "10/02/2024", status: "Đang làm việc", avatar: "Y", busyDays: ["Thứ 3", "Thứ 5"] },


  ]);

  const [selectedStaff, setSelectedStaff] = useState(staffList[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Xử lý thêm nhân viên và cập nhật danh sách
  const handleAddStaff = (newStaff) => {
    const updatedList = [newStaff, ...staffList];
    setStaffList(updatedList);
    setSelectedStaff(newStaff); // Tự động chọn nhân viên vừa thêm
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen space-y-8 pb-20 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Hồ sơ nhân sự</h1>
            <p className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em]">Hải Xóm HR Management</p>
          </div>
          
        </div>

        {/* Khu vực Profile (Phía trên theo ảnh vẽ) */}
        <StaffProfileCard staff={selectedStaff} />

        {/* Khu vực Bảng (Phía dưới) */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-slate-700 uppercase text-sm tracking-widest">Danh sách đội ngũ</h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest flex items-center gap-2"
          >
            <UserPlus size={16} /> Thêm nhân sự
          </button>
        </div>
          <StaffTable 
            staffList={staffList} 
            onSelect={(staff) => {
              setSelectedStaff(staff);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            selectedId={selectedStaff?.id}
          />
        </div>
      </div>

      {/* Modal Form */}
      <AddStaffModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddStaff} 
      />
    </div>
  );
};

export default StaffManager;