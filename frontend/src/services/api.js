import axios from "axios";

// In production this comes from an env var (import.meta.env.VITE_API_URL),
// hardcoded here for local dev simplicity.
const API_BASE = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export const getApplications = (status) =>
  api.get("/applications", { params: status ? { status } : {} }).then((res) => res.data);

export const getApplication = (id) =>
  api.get(`/applications/${id}`).then((res) => res.data);

export const createApplication = (data) =>
  api.post("/applications", data).then((res) => res.data);

export const updateApplication = (id, data) =>
  api.put(`/applications/${id}`, data).then((res) => res.data);

export const deleteApplication = (id) =>
  api.delete(`/applications/${id}`);
