import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function LoginPage({ role }: { role?: "doctor" | "marketing" }) {
  const navigate = useNavigate();
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

      if (role === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/marketing");
      }
    } catch (e) {
      setError("Email və ya şifrə yanlışdır");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>
        {role === "doctor"
          ? "Həkim girişi"
          : role === "marketing"
          ? "Marketinq girişi"
          : "Giriş"}
      </h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Şifrə"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Daxil ol</button>

      <hr />

      <p><a href="#/login/doctor">Həkim kimi daxil ol</a></p>
      <p><a href="#/login/marketing">Marketinq kimi daxil ol</a></p>
    </div>
  );
}
