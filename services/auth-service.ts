import { cookies } from "@/utils/cookies";
import { apiRequest } from "@/utils/api";

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  name?: string;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface AuthUser {
  id: string;
  login: string;
  name: string;
  role: string;
  token: string;
}

// Authentication service
export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      // Make a login request to the API
      const response = await apiRequest<{ user: AuthUser }>("/users/login", {
        method: "POST",
        body: credentials,
      });

      const user = response.user;

      // Store the auth token in a cookie
      if (user && user.token) {
        cookies.set("access_token", user.token, {
          path: "/",
          maxAge: 24 * 60 * 60, // 1 day
        });

        // Store user data in a cookie
        cookies.set("user_data", JSON.stringify(user), {
          path: "/",
          maxAge: 24 * 60 * 60, // 1 day
        });
      }

      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout(): void {
    // Remove cookies
    cookies.remove("access_token");
    cookies.remove("user_data");
  },

  isAuthenticated(): boolean {
    // Check if token exists in cookies
    return !!cookies.get("access_token");
  },

  getToken(): string | null {
    // Get token from cookies
    return cookies.get("access_token") || null;
  },

  getCurrentUser(): AuthUser | null {
    try {
      // Get user data from cookies
      const userData = cookies.get("user_data");
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error("Error parsing user data from cookie:", e);
      return null;
    }
  },
};

export default AuthService;
