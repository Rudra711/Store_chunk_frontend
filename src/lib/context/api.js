// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api",
  withCredentials: false, // set true only if you use httpOnly cookies
});

// Attach JWT if you store it (e.g., localStorage or context)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or pull from your UserContext
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
