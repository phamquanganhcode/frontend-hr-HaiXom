import axiosClient from "./axiosClient";

const attendanceApi = {
  getTodaySummary: () => {
    return axiosClient.get('/attendance/today-summary');
  },

  // Sử dụng employeeId (khớp với bảng Employee.id)
  getSalaryHistory: (employeeId, month, year) => {
    return axiosClient.get(`/attendance/salary-history`, {
      params: { employee_id: employeeId, month, year }
    });
  },

  getWeeklySchedule: (startDate) => {
    return axiosClient.get('/attendance/schedule', {
      params: { start_date: startDate }
    });
  },

  getAvailableShifts: () => {
    return axiosClient.get('/shifts/available');
  },

  registerMultipleShifts: (shifts) => {
    return axiosClient.post('/attendance/register-shifts', { shifts });
  },

  logAttendance: (data) => {
    return axiosClient.post('/attendance/log', data);
  }
};

export default attendanceApi;