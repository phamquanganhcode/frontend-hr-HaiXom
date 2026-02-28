import axiosClient from "./axiosClient";

const authApi = {
  // Đăng nhập trả về Token và thông tin Account cơ bản
  login: (credentials) => {
    const url = '/auth/login';
    return axiosClient.post(url, credentials);
  },

  /**
   * Lấy thông tin cá nhân đầy đủ của người đang đăng nhập.
   * Backend cần JOIN bảng Account -> Employee -> Branch & Position
   * Để frontend dùng được: data?.employee?.full_name, data?.employee?.branch?.name
   */
  getMe: () => {
    const url = '/auth/me';
    return axiosClient.get(url);
  },

  logout: () => {
    const url = '/auth/logout';
    return axiosClient.post(url);
  }
};

export default authApi;