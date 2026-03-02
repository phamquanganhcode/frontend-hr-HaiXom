import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import authApi from "../api/authApi";
import logoImage from "../assets/images/restaurant-bg.jpg";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const bgUrl =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop";

  // --- DATA GIẢ LẬP (SỬ DỤNG KHI CHƯA CÓ BACKEND) ---
  const MOCK_USERS = [
    { username: "admin", password: "123", role: 1, name: "Quản trị viên" },
    { username: "manager", password: "123", role: 2, name: "Quản lý cơ sở" },
    {
      username: "nhanvien",
      password: "123",
      role: 3,
      name: "Nguyễn Văn Trường",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  // 1. Bổ sung useEffect để dọn dẹp bộ nhớ khi vào trang Login
  React.useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 2. Thử gọi API thực tế
      const response = await authApi.login(credentials);

      // Kiểm tra nếu response trả về đúng cấu trúc (nhờ axiosClient đã return response.data)
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        // Đổi tên thành user_data cho đồng bộ với axiosClient
        localStorage.setItem("user_data", JSON.stringify(response.user));

        console.log("Đăng nhập API thành công!");
        redirectByRole(response.user.role);
        return; // Thoát hàm nếu thành công
      }

      throw new Error("Dữ liệu trả về không hợp lệ");
    } catch {
      console.warn("Backend lỗi hoặc chưa sẵn sàng. Thử Mock Data...");

      // 3. Logic giả lập (Giữ nguyên của bạn nhưng đổi tên Key)
      const foundUser = MOCK_USERS.find(
        (u) =>
          u.username === credentials.username &&
          u.password === credentials.password,
      );

      if (foundUser) {
        localStorage.setItem("token", "mock-token-24h-safe-xyz");
        localStorage.setItem(
          "user_data",
          JSON.stringify({
            name: foundUser.name,
            role: foundUser.role,
            username: foundUser.username
          }),
        );

        redirectByRole(foundUser.role);
      } else {
        // Chỉ hiện lỗi nếu cả API và Mock đều không khớp
        setError("Tên đăng nhập hoặc mật khẩu không đúng!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Tách hàm điều hướng để dùng chung cho cả 2 trường hợp
  const redirectByRole = (role) => {
    if (role === 1) navigate("/admin/dashboard");
    else if (role === 2) navigate("/manager/dashboard");
    else navigate("/employee/dashboard");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 relative"
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      <div className="max-w-md w-full space-y-8 bg-white/95 p-8 rounded-2xl shadow-2xl border-t-4 border-red-600 relative z-10">
        <div className="text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <img
              src={logoImage}
              alt="Hải Xồm Logo"
              className="w-20 h-20 object-cover rounded-full border-2 border-red-600 shadow-lg"
            />
            <h2 className="text-3xl font-extrabold text-red-600 tracking-tight">
              HẢI XỒM HR
            </h2>
          </div>
          <p className="mt-2 text-sm text-gray-600 font-medium italic">
            "Hệ thống quản trị nhân sự thông minh"
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <User size={20} />
              </span>
              <input
                name="username"
                type="text"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                placeholder="Tên đăng nhập"
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock size={20} />
              </span>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                placeholder="Mật khẩu"
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-2 animate-pulse">
              <p className="text-red-700 text-xs font-bold">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg text-white bg-red-600 hover:bg-red-700 font-bold transition-all shadow-lg hover:shadow-red-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
            </button>
          </div>

          {/* Note nhỏ để bạn nhớ tài khoản test */}
          <p className="text-[10px] text-center text-gray-400">
            Gợi ý: nhanvien - 123 / admin - 123 / manager - 123
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
