import { api } from "./api";
import type { User } from "@/types";

export function updateUser(
  userId: string,
  data: Partial<{
    email: string;
    name: { firstName: string; middleName?: string; lastName: string };
  }>,
) {
  return api.put<User>(`/api/users/${userId}`, data);
}

export function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  return api.post<{ message: string }>("/api/auth/change-password", {
    currentPassword,
    newPassword,
  });
}
