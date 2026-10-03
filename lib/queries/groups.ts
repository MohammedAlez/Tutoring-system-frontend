export interface GroupSchedule {
  day: string;
  startTime: string;
  endTime: string;
}

export interface GroupRecord {
  id: string;
  name: string;
  type: "GROUP" | "INDIVIDUAL";
  subject: string;
  level: string;
  room?: string | null;
  isOnline: boolean;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  _count?: {
    students: number;
  };
  schedules?: GroupSchedule[];
}

export interface CreateGroupInput {
  name: string;
  type: "GROUP" | "INDIVIDUAL";
  subject: string;
  level: string;
  room?: string | null;
  isOnline: boolean;
}

export const groupKeys = {
  all: ["groups"] as const,
  list: (type: string, search: string) => ["groups", "list", { type, search }] as const,
  detail: (id: string) => ["groups", "detail", id] as const,
};