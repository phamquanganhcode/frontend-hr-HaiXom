import React from "react";
import { Construction, ArrowLeft } from "lucide-react";

const ShiftMarket = () => {

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
        {/* Icon minh họa */}
        <div className="inline-flex p-6 bg-amber-100 rounded-[2.5rem] text-amber-600 shadow-xl shadow-amber-100/50">
          <Construction size={48} strokeWidth={2.5} />
        </div>

        {/* Nội dung thông báo */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            Chợ đổi ca
          </h1>
          <p className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em]">
            Chức năng đang phát triển
          </p>
        </div>

        <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto leading-relaxed">
          Hệ thống đang được nâng cấp để giúp bạn trao đổi ca làm việc thuận tiện hơn. Vui lòng quay lại sau!
        </p>

      </div>
    </div>
  );
};

export default ShiftMarket;