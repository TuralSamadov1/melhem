import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function LoginPage({ role }: { role: "doctor" | "marketing" }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/login/", { username, password });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem(
        "user",
        JSON.stringify({ role })
      );

      navigate("/dashboard");
    } catch {
      setError("Email və ya şifrə yanlışdır");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-mist">
      <div className="bg-white p-8 rounded-3xl w-[360px] space-y-4">
        {/* geri */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-brand-primary flex items-center gap-2"
        >
          ← geri qayıt
        </button>

        <h2 className="text-2xl font-bold italic text-center">
          {role === "doctor" ? "Həkim girişi" : "Marketinq girişi"}
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          className="w-full border rounded-xl px-4 py-2"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full border rounded-xl px-4 py-2"
          placeholder="Şifrə"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold"
        >
          Daxil ol
        </button>
      </div>
    </div>
  );
}
