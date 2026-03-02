import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import EmployeeLayout from './components/Layouts/Employee/EmployeeLayout';
import EmployeeDashboard from './pages/Employee/Dashboard';
import EmployeeProfile from './pages/Employee/Profile';
import EmployeeSalary from './pages/Employee/Salary';
import EmployeeSchedule from './pages/Employee/Schedule';
import Login from './pages/Login';


/**
 * COMPONENT BẢO VỆ ROUTE
 * Kiểm tra xem có Token (đã đăng nhập) chưa. 
 * Nếu chưa, đá văng ra trang Login.
 */
const ProtectedRoute = () => {
  const token = localStorage.getItem('token'); 

  // Kiểm tra token có tồn tại và không phải là chuỗi rác
  const isAuthenticated = token && token !== 'undefined' && token !== 'null';

  if (!isAuthenticated) {
    // Nếu token rác, dọn dẹp luôn cho sạch máy
    if (token) {
      localStorage.removeItem('token');
      localStorage.removeItem('user_data');
    }
    
    // Đá về login, dùng replace để không thể bấm 'Back' quay lại
    return <Navigate to="/login" replace />;
  }

  // Nếu ok, cho vào trang con (Dashboard, Salary, v.v.)
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Trang Login công khai */}
        <Route path="/login" element={<Login />} />

        {/* 2. Nhóm các trang CẦN ĐĂNG NHẬP mới vào được */}
        <Route element={<ProtectedRoute />}>
          <Route path="/employee" element={<EmployeeLayout />}>
            {/* Mặc định khi vào /employee sẽ chuyển tới dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="salary" element={<EmployeeSalary />} />
            <Route path="schedule" element={<EmployeeSchedule />} />

            {/* Các trang khác như /employee/salary sẽ thêm ở đây */}
          </Route>
        </Route>

        {/* 3. Điều hướng mặc định khi mở App */}
        <Route path="/" element={<Navigate to="/employee/dashboard" replace />} />
        
        {/* 4. Trang 404 (Nếu cần) - Chuyển về login nếu gõ bậy bạ */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;