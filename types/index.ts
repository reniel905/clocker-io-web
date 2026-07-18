import type { User } from "./user";
export type { User } from "./user";
export type { TimeRecord } from "./timeRecord";

export type AuthResponse = {
  message: string;
  user: User;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    totalDocuments: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
};
