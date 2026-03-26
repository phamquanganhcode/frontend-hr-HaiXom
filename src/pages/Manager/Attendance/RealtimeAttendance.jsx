import React, { useState, useEffect } from "react";
import Echo from "laravel-echo";
import windowPusher from "pusher-js";
import {
  Search,
  Filter,
  Download,
  Calendar as CalendarIcon,
  Fingerprint,
  ScanFace,
  Loader2,
  Edit3,
  X,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";

const RealtimeAttendance = () => {
  // ================= STATE DỮ LIỆU & LỌC =================
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  // 🟢 Hàm lấy đúng ngày hiện tại theo múi giờ máy tính
  const getLocalYYYYMMDD = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [filterDate, setFilterDate] = useState(getLocalYYYYMMDD());
  const [filterStatus, setFilterStatus] = useState("Tất cả trạng thái");

  // ================= STATE MODAL & FORM =================
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({ status: "", note: "" });
  const [formError, setFormError] = useState("");

  // ================= STATE THÔNG BÁO (TOAST) =================
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // 1. HÀM GỌI API (Fetch Data)
  const fetchRealtimeData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // Truyền ngày vào API để lọc theo ngày
      const response = await axios.get(
        `http://115.146.126.49:8084/api/v1/time-logs/realtime?date=${filterDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.data && response.data.data) {
        setData(response.data.data);
      } else {
        setData([]);
      }
      setLastUpdated(new Date().toLocaleTimeString("vi-VN"));
    } catch (err) {
      console.error("Lỗi API:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. TỰ ĐỘNG GỌI API KHI CHỌN NGÀY & AUTO REFRESH
  // 2. TỰ ĐỘNG GỌI API & BẬT WEBSOCKETS
  useEffect(() => {
    // Gọi lần đầu để lấy data
    fetchRealtimeData();

    // -- BẬT ĂNG TEN THU SÓNG PUSHER --
    window.Pusher = windowPusher;
    const echo = new Echo({
      broadcaster: "pusher",
      key: "89c675856ea8e86af596", // Copy App Key từ trang Pusher
      cluster: "ap1",
      forceTLS: true,
    });

    // Lắng nghe đài FM "attendance-channel"
    echo.channel("attendance-channel").listen(".new-scan", (event) => {
      console.log("📡 TÍN HIỆU TỪ IOT:", event);
      // Khi có người quẹt thẻ, ngay lập tức gọi lại API để làm mới bảng
      fetchRealtimeData();
      triggerToast(`Nhân viên ${event.employee_code} vừa quẹt thẻ!`);
    });

    // Khi thoát trang thì tắt ăng-ten đi cho đỡ tốn tài nguyên
    return () => {
      echo.disconnect();
    };
  }, [filterDate]); // Chạy lại khi đổi ngày

  // 3. LOGIC LỌC DỮ LIỆU BẢNG (Search & Filter Status)
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "Tất cả trạng thái" ||
      item.status.toUpperCase() === filterStatus.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  // 4. XỬ LÝ MỞ MODAL SỬA
  const openEditModal = (record) => {
    setEditingRecord(record);
    setEditForm({
      status: record.status,
      note: record.note === "-" ? "" : record.note,
    });
    setFormError("");
    setIsEditModalOpen(true);
  };

  // 5. BẤM LƯU THAY ĐỔI -> VALIDATE
  const handleSaveClick = () => {
    // Nếu đổi trạng thái mà không ghi chú -> Báo lỗi
    if (editForm.status !== editingRecord.status && !editForm.note.trim()) {
      setFormError(
        "Bắt buộc phải nhập lý do (Ghi chú) khi thay đổi trạng thái!",
      );
      return;
    }
    setFormError("");
    setIsConfirmModalOpen(true); // Mở popup xác nhận
  };

  // 6. XÁC NHẬN LƯU
  // 6. XÁC NHẬN LƯU (GỌI API LÊN SERVER)
  // 6. XÁC NHẬN LƯU (GỌI API LÊN SERVER)
  const confirmSave = async () => {
    try {
      const token = localStorage.getItem("token");

      // 🟢 Cập nhật State React ngay lập tức để UI không bị giật (Optimistic Update)
      // CHÚ Ý: Dùng item.record_id để đảm bảo chỉ sửa ĐÚNG CÁI DÒNG VỪA BẤM, không sửa các dòng khác của cùng nhân viên
      const updatedData = data.map((item) => {
        if (item.record_id === editingRecord.record_id) {
          return {
            ...item,
            status: editForm.status,
            note: editForm.note || "-",
          };
        }
        return item;
      });
      setData(updatedData);

      // Bắn dữ liệu cập nhật lên Backend
      await axios.post(
        "http://115.146.126.49:8084/api/v1/time-logs/exception",
        {
          record_id: editingRecord.record_id,
          status: editForm.status,
          note: editForm.note || "-",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Đóng modal & Hiện thông báo
      setIsConfirmModalOpen(false);
      setIsEditModalOpen(false);
      triggerToast("Đã lưu xử lý ngoại lệ vĩnh viễn vào Database!");
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Đã xảy ra lỗi khi lưu vào Database!");
    }
  };
  // 7. HIỆN THÔNG BÁO TOAST
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000); // Tự tắt sau 5s
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans relative">
      {/* ================= THÔNG BÁO TOAST GÓC TRÊN ================= */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-right-8 duration-300">
          <div className="bg-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-50 min-w-[300px]">
            <div className="bg-emerald-500 p-2 rounded-xl text-white">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">Thành công!</p>
              <p className="text-xs text-slate-500 font-medium">{toastMsg}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="ml-auto p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg"
            >
              <X size={16} />
            </button>
          </div>
          <div className="absolute bottom-0 left-4 right-4 h-1 bg-emerald-500/20 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 animate-out slide-out-to-left-full duration-[5000ms] ease-linear"></div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase">
              Máy chấm công (Online)
            </span>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        {/* ================= THANH CÔNG CỤ TÌM KIẾM & LỌC ================= */}
        <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-lg">
                Chấm công Realtime{" "}
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-[10px] font-medium text-slate-400 mt-1">
                Cập nhật lần cuối: {lastUpdated}
              </span>
            </div>
            {/* Ô TÌM KIẾM */}
            <div className="relative ml-4">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Tìm Mã NV, Họ tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 w-64 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* CHỌN NGÀY */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 hover:border-indigo-300 transition-colors">
              <CalendarIcon size={14} className="text-slate-400 mr-2" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer"
              />
            </div>

            {/* LỌC TRẠNG THÁI */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none cursor-pointer hover:border-indigo-300"
            >
              <option value="Tất cả trạng thái">Tất cả trạng thái</option>
              <option value="ĐÚNG GIỜ">Đúng giờ</option>
              <option value="ĐI MUỘN">Đi muộn</option>
              <option value="NGHỈ">Nghỉ</option>
            </select>

            <button
              onClick={fetchRealtimeData}
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <Filter size={14} /> Làm mới
            </button>

            {/* XUẤT EXCEL */}
            <button
              onClick={() =>
                triggerToast(
                  "Đã xuất file Excel bảng công ngày " +
                    filterDate +
                    " thành công!",
                )
              }
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
            >
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {/* ================= BẢNG DỮ LIỆU ================= */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4 text-left">Mã NV</th>
                <th className="px-6 py-4 text-left">Họ tên</th>
                <th className="px-6 py-4 text-left">Bộ phận</th>
                <th className="px-6 py-4 text-center">Ca</th>
                <th className="px-6 py-4 text-center">Check-in</th>
                <th className="px-6 py-4 text-center">Check-out</th>
                <th className="px-6 py-4 text-center">Phương thức</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-left">Ghi chú</th>
                <th className="px-6 py-4 text-center">Xử lý ngoại lệ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && data.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-12 text-center text-slate-400 text-sm font-medium"
                  >
                    <Loader2
                      size={24}
                      className="animate-spin mx-auto mb-2 text-indigo-500"
                    />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-12 text-center text-slate-400 text-sm font-medium"
                  >
                    Không tìm thấy dữ liệu phù hợp.
                  </td>
                </tr>
              ) : (
                filteredData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-[11px] font-bold text-slate-500">
                      {row.id}
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-slate-800">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">
                      {row.department}
                    </td>
                    <td className="px-6 py-4 text-xs text-center font-bold text-slate-600">
                      {row.shift}
                    </td>
                    <td className="px-6 py-4 text-xs text-center font-black text-slate-800">
                      {row.check_in}
                    </td>
                    <td className="px-6 py-4 text-xs text-center font-black text-slate-800">
                      {row.check_out}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-500">
                        {row.method === "Khuôn mặt" ? (
                          <ScanFace size={14} className="text-pink-500" />
                        ) : (
                          <Fingerprint size={14} className="text-indigo-500" />
                        )}
                        {row.method}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                          row.status?.toUpperCase() === "ĐÚNG GIỜ"
                            ? "bg-emerald-50 text-emerald-600"
                            : row.status?.toUpperCase() === "ĐI MUỘN"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-rose-50 text-rose-500"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 text-[10px] font-bold text-slate-400 italic max-w-[150px] truncate"
                      title={row.note}
                    >
                      {row.note}
                    </td>

                    {/* CỘT NÚT SỬA */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openEditModal(row)}
                        className="p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                        title="Xử lý ngoại lệ"
                      >
                        <Edit3 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL XỬ LÝ NGOẠI LỆ ================= */}
      {isEditModalOpen && editingRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Edit3 size={20} className="text-indigo-600" /> Xử lý Ngoại lệ
                Chấm công
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Form Read-only */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Mã NV
                  </label>
                  <input
                    type="text"
                    value={editingRecord.id}
                    disabled
                    className="w-full mt-1 px-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-bold text-slate-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    value={editingRecord.name}
                    disabled
                    className="w-full mt-1 px-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Bộ phận
                  </label>
                  <input
                    type="text"
                    value={editingRecord.department}
                    disabled
                    className="w-full mt-1 px-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-medium text-slate-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Ca làm việc
                  </label>
                  <input
                    type="text"
                    value={editingRecord.shift}
                    disabled
                    className="w-full mt-1 px-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-medium text-slate-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Check-in
                  </label>
                  <input
                    type="text"
                    value={editingRecord.check_in}
                    disabled
                    className="w-full mt-1 px-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-black text-slate-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Check-out
                  </label>
                  <input
                    type="text"
                    value={editingRecord.check_out}
                    disabled
                    className="w-full mt-1 px-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-black text-slate-600"
                  />
                </div>
              </div>

              {/* Form Cho phép Edit */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-indigo-600 uppercase flex items-center gap-1">
                    Trạng thái mới <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="ĐÚNG GIỜ">Đúng giờ</option>
                    <option value="ĐI MUỘN">Đi muộn</option>
                    <option value="NGHỈ">Nghỉ</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-indigo-600 uppercase flex items-center gap-1">
                    Ghi chú / Lý do{" "}
                    {editForm.status !== editingRecord.status && (
                      <span className="text-rose-500">(Bắt buộc) *</span>
                    )}
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Nhập lý do điều chỉnh..."
                    value={editForm.note}
                    onChange={(e) =>
                      setEditForm({ ...editForm, note: e.target.value })
                    }
                    className={`w-full mt-1 px-4 py-3 bg-white border rounded-xl text-sm font-medium outline-none focus:ring-1 transition-colors ${formError ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"}`}
                  ></textarea>
                  {formError && (
                    <p className="text-xs font-bold text-rose-500 mt-1 flex items-center gap-1">
                      <AlertTriangle size={12} /> {formError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 flex justify-end gap-3 rounded-b-[32px]">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2.5 font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors text-sm"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveClick}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all text-sm"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= POPUP XÁC NHẬN (CONFIRM) ================= */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in duration-200 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-amber-500" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">
              Xác nhận thay đổi?
            </h3>
            <p className="text-sm font-medium text-slate-500 mb-6">
              Bạn có chắc chắn muốn lưu các điều chỉnh ngoại lệ cho nhân viên{" "}
              <strong className="text-slate-800">{editingRecord?.name}</strong>{" "}
              không?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-5 py-2.5 font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-sm flex-1"
              >
                Xem lại
              </button>
              <button
                onClick={confirmSave}
                className="px-5 py-2.5 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-600 active:scale-95 transition-all text-sm flex-1"
              >
                Đồng ý lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealtimeAttendance;
