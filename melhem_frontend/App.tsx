import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import MarketingDashboard from "./pages/MarketingDashboard";

const App: React.FC = () => {
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="/login/doctor" element={<LandingPage />} />
        <Route path="/login/marketing" element={<LandingPage />} />

        <Route
          path="/doctor"
          element={
            token && role === "doctor"
              ? <DoctorDashboard />
              : <Navigate to="/login/doctor" replace />
          }
        />

        <Route
          path="/marketing"
          element={
            token && role === "marketing"
              ? <MarketingDashboard />
              : <Navigate to="/login/marketing" replace />
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
