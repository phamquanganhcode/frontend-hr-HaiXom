import axiosClient from "./axiosClient";

const userApi = {
  // Đồng bộ với authApi.getMe để lấy đầy đủ thông tin lồng nhau
  getProfile: () => {
    return axiosClient.get('/user/profile');
  },
  
  // Cập nhật thông tin cá nhân (nếu có tính năng sửa hồ sơ)
  updateProfile: (data) => {
    return axiosClient.put('/user/profile', data);
  }
};

export default userApi;