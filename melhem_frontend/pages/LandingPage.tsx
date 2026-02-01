import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDoctor = location.pathname === "/login/doctor";
  const isMarketing = location.pathname === "/login/marketing";

  const role = isDoctor ? "doctor" : isMarketing ? "marketing" : null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/login/", {
        email,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("role", role || "marketing");

      navigate(role === "doctor" ? "/doctor" : "/marketing");
    } catch {
      setError("Email və ya şifrə yanlışdır");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-white">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 space-y-6">
        <h1 className="text-3xl font-black text-brand-primary italic text-center">
          Məlhəm
        </h1>

        {!role && (
          <div className="space-y-4">
            <button
              onClick={() => navigate("/login/doctor")}
              className="w-full py-4 rounded-xl bg-brand-primary text-white font-bold hover:opacity-90 transition"
            >
              Həkim girişi
            </button>

            <button
              onClick={() => navigate("/login/marketing")}
              className="w-full py-4 rounded-xl border border-brand-primary text-brand-primary font-bold hover:bg-brand-primary hover:text-white transition"
            >
              Marketinq girişi
            </button>
          </div>
        )}

        {role && (
        <div className="space-y-4">
            <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-sm text-violet-500 hover:text-brand-primary transition font-semibold"
            >
            ← Geri qayıt
            </button>

            <h2 className="text-xl font-bold text-center">
            {role === "doctor" ? "Həkim girişi" : "Marketinq girişi"}
            </h2>

            {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <input
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <input
              className="w-full border rounded-xl px-4 py-3"
              type="password"
              placeholder="Şifrə"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <button
              onClick={handleLogin}
              className="w-full py-4 rounded-xl bg-brand-primary text-white font-bold hover:opacity-90 transition"
            >
              Daxil ol
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
