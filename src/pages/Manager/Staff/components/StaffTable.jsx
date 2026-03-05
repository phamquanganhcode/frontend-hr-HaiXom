import React from "react";

const StaffTable = ({ staffList, onSelect, selectedId }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-8">Nhân viên</th>
            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vị trí</th>
            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Liên hệ</th>
            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-8">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((item) => (
            <tr 
              key={item.id}
              onClick={() => onSelect(item)}
              className={`group cursor-pointer transition-all ${selectedId === item.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
            >
              <td className="p-4 pl-8 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-sm ${selectedId === item.id ? 'bg-indigo-600' : 'bg-slate-300 group-hover:bg-indigo-400'}`}>
                    {item.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-700">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{item.id}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 border-b border-slate-50">
                <p className="text-xs font-bold text-slate-600">{item.position}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">{item.role}</p>
              </td>
              <td className="p-4 border-b border-slate-50 text-xs font-bold text-slate-600">{item.phone}</td>
              <td className="p-4 border-b border-slate-50 text-right pr-8">
                <button className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;