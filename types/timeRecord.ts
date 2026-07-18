export type TimeRecord = {
  _id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  isActive: boolean;
  recordType: "auto" | "custom";
  editReason?: string;
  createdAt?: string;
  updatedAt?: string;
};
