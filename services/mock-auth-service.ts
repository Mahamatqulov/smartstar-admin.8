import { cookies } from "@/utils/cookies";
import type { LoginCredentials, AuthUser } from "./auth-service";

// Mock user data
const MOCK_USER: AuthUser = {
  id: "mock-1",
  login: "admin",
  name: "Admin User",
  role: "admin",
  token: "mock-token-12345",
};

// Mock authentication service for development and preview environments
export const MockAuthService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check credentials (simple mock validation)
    if (credentials.login === "admin" && credentials.password === "admin123") {
      // Store mock token in cookie
      cookies.set("access_token", MOCK_USER.token, {
        path: "/",
        maxAge: 24 * 60 * 60, // 1 day
      });

      // Store mock user data in cookie
      cookies.set("user_data", JSON.stringify(MOCK_USER), {
        path: "/",
        maxAge: 24 * 60 * 60, // 1 day
      });

      return MOCK_USER;
    }

    throw new Error("Invalid credentials");
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
      return userData ? JSON.parse(userData) : MOCK_USER;
    } catch (e) {
      console.error("Error parsing user data from cookie:", e);
      return null;
    }
  },
};

export default MockAuthService;
