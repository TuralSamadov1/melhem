import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import MarketingDashboard from "./pages/MarketingDashboard";

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("access_token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Login pages */}
        <Route path="/login/doctor" element={<LoginPage role="doctor" />} />
        <Route path="/login/marketing" element={<LoginPage role="marketing" />} />

        {/* Dashboard (ortaq giriş nöqtəsi) */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardRouter />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

/* 🔽 ROLE-A GÖRƏ DASHBOARD SEÇƏN KOMPONENT */
const DashboardRouter = () => {
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (user?.role === "MARKETING") {
    return <MarketingDashboard />;
  }

  return <DoctorDashboard />;
};

export default App;
