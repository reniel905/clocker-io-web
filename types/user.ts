export type User = {
  _id: string;
  email: string;
  name: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  userType: "employee" | "admin";
  authProvider?: "local" | "google";
  isVerified?: boolean;
  targetHours?: number;
  targetDate?: string;
  allowOverTime?: boolean;
  allowWeekEnds?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
