import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "./assets/pages/LoginPage";
import TeachersPage from "./assets/pages/TeachersPage";
import StudentsPage from "./assets/pages/StudentsPage";
import DashboardPage from "./assets/pages/DashboardPage";
import NotFoundPage from "./assets/pages/NotFoundPage";
import { IS_LOGIN } from "./constants";
import AdminLayout from "./assets/components/layout/AdminLayout";
import StudentsByTeacher from "./assets/pages/StudentsByTeacher";

function App() {
  const [isLogin, setIsLogin] = useState(Boolean(localStorage.getItem(IS_LOGIN)));
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage setIsLogin={setIsLogin} />} />
        {isLogin ? (
          <Route element={<AdminLayout setIsLogin={setIsLogin} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/teachers/:teachersId" element={<StudentsByTeacher />} />
          </Route>
        ) : null}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
