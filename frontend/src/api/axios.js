// src/api/axios.js
// Pre-configured axios instance — automatically attaches JWT token to every request

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

// Attach JWT token from localStorage before every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("qb_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem("qb_token") !== "demo_token") {
      localStorage.removeItem("qb_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export default api;
