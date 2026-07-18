import { api } from "./api";
import type { AuthResponse } from "@/types";

export function login(email: string, password: string) {
  return api.post<AuthResponse>("/api/auth/login", { email, password });
}

export function register(data: {
  email: string;
  password: string;
  name: { firstName: string; middleName?: string; lastName: string };
}) {
  return api.post<{ message: string }>("/api/auth/register", data);
}

export function verifyOtp(email: string, otp: string) {
  return api.post<{ message: string }>("/api/auth/verify-otp", { email, otp });
}

export function googleLogin(googleToken: string) {
  return api.post<AuthResponse>("/api/auth/google", {
    googleToken,
  });
}
