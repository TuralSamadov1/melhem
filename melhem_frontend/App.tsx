import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import MarketingDashboard from "./pages/MarketingDashboard";

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("access");

  return (
    <BrowserRouter>
      <Routes>
        {/* Login / Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Doctor Dashboard */}
        <Route
          path="/doctor"
          element={
            isAuthenticated ? <DoctorDashboard /> : <Navigate to="/" replace />
          }
        />

        {/* Marketing Dashboard */}
        <Route
          path="/marketing"
          element={
            isAuthenticated ? <MarketingDashboard /> : <Navigate to="/" replace />
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
