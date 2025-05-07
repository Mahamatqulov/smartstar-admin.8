// import axios from "axios";
// import { cookies } from "@/utils/cookies";

// const API = axios.create({
//   baseURL: "http://91.213.99.20:4000/api",
//   withCredentials: true,
// });

// API.interceptors.request.use((config) => {
//   const token = cookies.get("access_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default API;

import axios from "axios";
import { cookies } from "@/utils/cookies";

// API instance yaratish
const API = axios.create({
  baseURL: "http://91.213.99.20:4000/api", // O'zgartirilgan baseURL
  withCredentials: true,
});

// So'rov yuborishdan oldin tokenni headerga qo'shish
API.interceptors.request.use((config) => {
  const token = cookies.get("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("⚠️ Token topilmadi");
  }
  return config;
});

// Xatoliklarni qayta ishlash
API.interceptors.response.use(
  (response) => response, // Agar javob muvaffaqiyatli bo'lsa, davom etamiz
  (error) => {
    if (error.response?.status === 401) {
      // Token noto‘g‘ri yoki muddati tugagan bo‘lsa, cookies tozalash
      console.warn(" 401 - Token noto‘g‘ri yoki muddati tugagan");
      cookies.remove("access_token");
      cookies.remove("user_data");
    }
    return Promise.reject(error);
  }
);

export default API;
