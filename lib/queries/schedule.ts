export interface RecurringScheduleRule {
  id: string;
  tutorId: string;
  groupId: string;
  dayOfWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
  startTime: string; // e.g. "17:00"
  endTime: string;   // e.g. "19:00"
  room?: string | null;
  isOnline: boolean;
  group: {
    id: string;
    name: string;
    type: "GROUP" | "INDIVIDUAL";
    subject: string;
    level: string;
  };
}

export interface ScheduledSession {
  id: string;
  groupId: string;
  groupName: string;
  groupType: "GROUP" | "INDIVIDUAL";
  subject: string;
  level: string;
  scheduledStart: string; // ISO String
  scheduledEnd: string;   // ISO String
  actualStart?: string | null;
  actualEnd?: string | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  room?: string | null;
  isOnline: boolean;
  cancellationReason?: string | null;
}

export const scheduleKeys = {
  all: ["schedules"] as const,
  timetable: ["schedules", "timetable"] as const,
  sessions: (startDate: string, endDate: string) => ["sessions", "calendar", { startDate, endDate }] as const,
  sessionDetail: (sessionId: string) => ["sessions", "detail", sessionId] as const,
};