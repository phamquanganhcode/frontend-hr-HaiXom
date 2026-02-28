import axiosClient from "./axiosClient";

const employeeApi = {
  /**
   * Lấy chi tiết hồ sơ nhân viên bao gồm cả lịch sử công tác
   * Cấu trúc mong muốn: employee { ..., job_history: [...] }
   */
  getProfileDetail: (employeeId) => {
    const url = `/employees/${employeeId}/profile`;
    return axiosClient.get(url);
  },

  /**
   * Lấy riêng lịch sử thuyên chuyển công tác
   * Backend trả về mảng JobHistory JOIN với Branch và Position
   */
  getJobHistory: (employeeId) => {
    const url = `/employees/${employeeId}/job-history`;
    return axiosClient.get(url);
  }
};

export default employeeApi;