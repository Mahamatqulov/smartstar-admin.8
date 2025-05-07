import axios from "axios";
import { cookies } from "@/utils/cookies";

const API = axios.create({
  baseURL: "http://91.213.99.20:4000/api",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = cookies.get("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
