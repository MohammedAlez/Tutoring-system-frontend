export interface GroupDetail {
  id: string;
  name: string;
  type: "GROUP" | "INDIVIDUAL";
  subject: string;
  level: string;
  room?: string | null;
  isOnline: boolean;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  createdAt: string;
  schedules: GroupScheduleSlot[];
  students: GroupStudentMember[];
  _count: {
    sessions: number;
    students: number;
  };
}

export interface GroupScheduleSlot {
  id: string;
  dayOfWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
  startTime: string;
  endTime: string;
  room?: string | null;
  isOnline: boolean;
}

export interface GroupStudentMember {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  parentPhone?: string | null;
  status: "ACTIVE" | "INACTIVE";
  joinedAt: string;
}

export interface AttendanceStatItem {
  studentId: string;
  firstName: string;
  lastName: string;
  stats: {
    totalSessions: number;
    present: number;
    late: number;
    absent: number;
    excused: number;
    attendancePercentage: number;
  };
}

export interface GroupAttendanceStats {
  groupId: string;
  totalCompletedSessions: number;
  students: AttendanceStatItem[];
}

export const groupKeys = {
  all: ["groups"] as const,
  detail: (groupId: string) => ["groups", "detail", groupId] as const,
  attendanceStats: (groupId: string) => ["groups", "attendance-stats", groupId] as const,
  availableStudents: (search: string) => ["students", "available", { search }] as const,
};