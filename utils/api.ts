// import axios, {
//   type AxiosRequestConfig,
//   type AxiosResponse,
//   type AxiosError,
// } from "axios";
// import { cookies } from "@/utils/cookies";

// // Create a base axios instance with the provided configuration
// const apiClient = axios.create({
//   baseURL: "http://91.213.99.20:4000/api",
//   withCredentials: true,
// });

// // Add request interceptor to add auth token from cookies
// apiClient.interceptors.request.use((config) => {
//   const token = cookies.get("access_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Add response interceptor to handle common errors
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError) => {
//     // Handle 401 Unauthorized errors (token expired, etc.)
//     if (error.response?.status === 401) {
//       // Clear cookies and redirect to login if needed
//       cookies.remove("access_token");
//       cookies.remove("user_data");
//     }
//     return Promise.reject(error);
//   }
// );

// // Generic API request function
// export async function apiRequest<T>(
//   url: string,
//   options?: {
//     method?: string;
//     body?: any;
//     params?: Record<string, string>;
//     headers?: Record<string, string>;
//   }
// ): Promise<T> {
//   try {
//     const config: AxiosRequestConfig = {
//       method: options?.method || "GET",
//       url,
//       params: options?.params,
//       headers: options?.headers,
//     };

//     if (options?.body) {
//       config.data = options.body;
//     }

//     const response: AxiosResponse<T> = await apiClient(config);
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       const axiosError = error as AxiosError;

//       // Network errors (no internet, server unreachable)
//       if (
//         error.code === "ECONNABORTED" ||
//         error.message.includes("Network Error")
//       ) {
//         console.error("Network error - server unreachable:", error.message);

//         // If in preview mode, we could return mock data here
//         if (isPreviewMode()) {
//           console.warn("Using mock data due to network error in preview mode");
//           throw new Error(`Network Error: Using mock data in preview mode`);
//         }

//         throw new Error(
//           `Network Error: Unable to connect to the server. Please check your internet connection.`
//         );
//       }

//       // Handle different error scenarios
//       if (!axiosError.response) {
//         // No response from server
//         console.error("No response from server:", axiosError.message);
//         throw new Error(`Network error: ${axiosError.message}`);
//       }

//       // Server responded with an error status
//       const status = axiosError.response.status;
//       const data = axiosError.response.data as any;

//       // Format error message based on response
//       const errorMessage =
//         data?.error || data?.message || `Request failed with status ${status}`;
//       console.error(`API Error (${status}):`, errorMessage);

//       throw new Error(errorMessage);
//     }

//     // Handle non-Axios errors
//     console.error("Unexpected error:", error);
//     throw error;
//   }
// }

// // Helper function to check if we're in preview mode
// export function isPreviewMode(): boolean {
//   return (
//     typeof window !== "undefined" &&
//     (window.location.hostname.includes("vercel.app") ||
//       window.location.hostname === "localhost" ||
//       window.location.hostname === "127.0.0.1" ||
//       process.env.NODE_ENV === "development")
//   );
// }

// export default apiClient;

import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import { cookies } from "@/utils/cookies";

// Base URL from .env.local
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api";

// Axios instance
const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

// Request interceptor – add token from cookies
apiClient.interceptors.request.use((config) => {
  const token = cookies.get("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Token qo‘shildi:", token);
  } else {
    console.warn(
      "⚠️ Token topilmadi – foydalanuvchi login qilmagan bo‘lishi mumkin"
    );
  }
  return config;
});

// Response interceptor – handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn(
        "🔒 401 – Token noto‘g‘ri yoki muddati tugagan. Cookies tozalanmoqda."
      );
      cookies.remove("access_token");
      cookies.remove("user_data");
    }
    return Promise.reject(error);
  }
);

// Universal API request function
export async function apiRequest<T>(
  url: string,
  options?: {
    method?: string;
    body?: any;
    params?: Record<string, string>;
    headers?: Record<string, string>;
  }
): Promise<T> {
  try {
    const config: AxiosRequestConfig = {
      method: options?.method || "GET",
      url,
      params: options?.params,
      headers: options?.headers,
      data: options?.body,
    };

    const response: AxiosResponse<T> = await apiClient(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        console.error(" Server javob bermayapti:", error.message);
        throw new Error(
          "Server bilan bog‘lanib bo‘lmadi. Internet aloqangizni tekshiring."
        );
      }

      const status = error.response.status;
      const data = error.response.data as any;
      const message = data?.message || data?.error || `Xatolik: ${status}`;

      console.error(` API xatoligi (${status}):`, message);
      throw new Error(message);
    }

    console.error("⚠️ Noma'lum xatolik:", error);
    throw error;
  }
}

// Preview mode aniqlovchi funksiya
export function isPreviewMode(): boolean {
  return (
    typeof window !== "undefined" &&
    (window.location.hostname.includes("vercel.app") ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      process.env.NODE_ENV === "development")
  );
}

export default apiClient;
