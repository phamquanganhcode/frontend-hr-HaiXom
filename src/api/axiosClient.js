import axios from 'axios';

const axiosClient = axios.create({
  // Sử dụng biến môi trường từ Vite
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request: Gắn token vào mỗi yêu cầu
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho Response: Xử lý dữ liệu và lỗi tập trung
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về thẳng data để code ở Component ngắn gọn hơn (ví dụ: res.employee)
    return response && response.data ? response.data : response;
  },
  (error) => {
    // Xử lý lỗi 401 (Hết hạn hoặc sai Token)
    if (error.response && error.response.status === 401) {
      console.warn("Phiên đăng nhập hết hạn. Đang quay về trang Login...");
      
      // Xóa sạch dấu vết cũ để tránh vòng lặp lỗi
      localStorage.removeItem('token');
      localStorage.removeItem('user_data');
      
      // Chuyển hướng về login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;