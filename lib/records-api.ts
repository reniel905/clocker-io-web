import { api } from "./api";
import type { TimeRecord, PaginatedResponse } from "@/types";

export function getRecords(page = 1, limit = 50) {
  return api.get<PaginatedResponse<TimeRecord>>(
    `/api/records?page=${page}&limit=${limit}`,
  );
}

export function getRecordsByUser(userId: string, page = 1, limit = 50) {
  return api.get<PaginatedResponse<TimeRecord>>(
    `/api/records/get-by-user/${userId}?page=${page}&limit=${limit}`,
  );
}

export function getRecord(recordId: string) {
  return api.get<{ record: TimeRecord }>(`/api/records/${recordId}`);
}

export function clockIn(userId: string) {
  return api.post<{ message: string }>("/api/users/clock-in", { userId });
}

export function clockOut(recordId: string) {
  return api.put<{ message: string }>(`/api/users/${recordId}/clock-out`);
}

export function updateRecord(
  recordId: string,
  data: { startTime: string; endTime: string; editReason: string; recordType?: string },
) {
  return api.put<{ message: string }>(`/api/records/${recordId}/update`, data);
}

export function createRecord(
  userId: string,
  data: { startTime: string; endTime: string },
) {
  return api.post<{ message: string }>(
    `/api/records/${userId}/custom-record`,
    { userId, ...data },
  );
}

export function deleteRecord(recordId: string) {
  return api.del<{ message: string }>(`/api/records/${recordId}/delete`);
}

export function createBatchRecords(
  userId: string,
  records: { userId: string; startTime: string; endTime: string; recordType: string }[],
) {
  return api.post<{ message: string; data: TimeRecord[] }>(
    `/api/records/${userId}/batch-custom`,
    { records },
  );
}
