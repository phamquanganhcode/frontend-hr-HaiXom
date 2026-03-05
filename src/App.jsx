import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import EmployeeLayout from './components/Layouts/Employee/EmployeeLayout';
import EmployeeDashboard from './pages/Employee/Dashboard';
import EmployeeProfile from './pages/Employee/Profile';
import EmployeeSalary from './pages/Employee/Salary';
import EmployeeSchedule from './pages/Employee/Schedule';
import Login from './pages/Login';
import ManagerLayout from './components/Layouts/Manager/ManagerLayout';
import ManagerProfile from './pages/Manager/ManagerProfile';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token'); 
  const isAuthenticated = token && token !== 'undefined' && token !== 'null';

  if (!isAuthenticated) {
    if (token) {
      localStorage.removeItem('token');
      localStorage.removeItem('user_data');
    }
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* NHÓM CẦN ĐĂNG NHẬP */}
        <Route element={<ProtectedRoute />}>
          
          {/* ROUTE CHO NHÂN VIÊN */}
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="salary" element={<EmployeeSalary />} />
            <Route path="schedule" element={<EmployeeSchedule />} />
          </Route>

          {/* ROUTE CHO QUẢN LÝ (Đã đưa vào trong Protected) */}
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<div>Trang chủ Quản lý</div>} />
            <Route path="staff" element={<div>Quản lý nhân sự</div>} />
            <Route path="scheduling" element={<div>Hệ thống xếp ca</div>} />
            <Route path="profile" element={<ManagerProfile />} />
          </Route>
          
        </Route>

        {/* ĐIỀU HƯỚNG THÔNG MINH TẠI TRANG CHỦ */}
        <Route path="/" element={<HomeRedirect />} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * Component hỗ trợ điều hướng dựa trên Role khi người dùng vào "/"
 */
const HomeRedirect = () => {
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const role = userData?.role; // Giả sử backend lưu role trong user_data

  if (!role) return <Navigate to="/login" replace />;
  if (role === 2) return <Navigate to="/manager/dashboard" replace />;
  return <Navigate to="/employee/dashboard" replace />;
};

export default App;