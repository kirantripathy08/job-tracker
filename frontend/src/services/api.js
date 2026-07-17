import axios from "axios";

// Vite exposes env vars prefixed with VITE_ via import.meta.env.
// Locally (no .env file), this falls back to localhost.
// In the production build, .env.production sets this to the real API Gateway URL.
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
