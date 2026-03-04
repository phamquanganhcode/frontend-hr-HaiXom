import axiosClient from "./axiosClient";

const attendanceApi = {
  // 1. Lấy tóm tắt hôm nay (Dùng cho Dashboard/Layout)
  getTodaySummary: () => {
    return axiosClient.get('/attendance/today-summary');
  },

  // 2. Lấy dữ liệu lương & chấm công tháng (Khớp với bảng Payroll & DailyAttendance)
  getSalaryHistory: (employee_id, month, year) => {
    return axiosClient.get(`/attendance/salary-history`, {
      // Gửi đúng tên trường trong DB để Backend không phải map lại
      params: { employee_id, month, year } 
    });
  },

  // 3. Lấy lịch phân ca (Khớp với bảng WorkSchedule)
  getWeeklySchedule: (employee_id, start_date) => {
    return axiosClient.get('/work-schedules', {
      params: { employee_id, start_date }
    });
  },

  // 4. Lấy danh sách ca trống (Khớp với bảng ShiftDefinition)
  getAvailableShifts: () => {
    return axiosClient.get('/shifts/definitions');
  },

  // 5. Đăng ký ca làm (Tác động vào bảng ShiftRegistration)
  registerMultipleShifts: (registrations) => {
    return axiosClient.post('/shift-registrations', { registrations });
  },

  // 6. Thực hiện chấm công (Tác động vào bảng DailyAttendance/TimeLog)
  logAttendance: (attendanceData) => {
    // attendanceData nên chứa: employee_id, date, check_in_time, device_id...
    return axiosClient.post('/attendance/log', attendanceData);
  }
};

export default attendanceApi;