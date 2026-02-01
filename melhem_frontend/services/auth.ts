import api from "./api";

export async function login(email: string, password: string) {
  const res = await api.post("/login/", { email, password });
  localStorage.setItem("access_token", res.data.access);
  localStorage.setItem("refresh_token", res.data.refresh);
  return res.data;
}

export async function register(payload: {
  username: string;
  password: string;
  full_name: string;
  degree: string;
  specialty: string;
  whatsapp: string;
  instagram?: string;
  website?: string;
}) {
  const res = await api.post("/register/", payload);
  return res.data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export async function getMe() {
  const res = await api.get("/me/");
  return res.data;
}