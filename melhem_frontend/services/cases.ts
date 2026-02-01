import api from "./api";

export async function getCases() {
  const res = await api.get("/cases/");
  return res.data;
}

export async function getCase(id: string | number) {
  const res = await api.get(`/cases/${id}/`);
  return res.data;
}
