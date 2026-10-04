// lib/queries/session-detail.ts

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | null;
export type SessionStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface StudentAttendanceRecord {
  studentId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  attendanceId: string | null;
  status: AttendanceStatus;
  note: string | null;
}

export interface SessionDetailData {
  id: string;
  groupId: string;
  groupName: string;
  groupType: string;
  subject: string;
  level: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  status: SessionStatus;
  room: string | null;
  isOnline: boolean;
  cancellationReason: string | null;
  students: StudentAttendanceRecord[];
}

export interface SaveAttendancePayloadItem {
  studentId: string;
  status: AttendanceStatus;
  note: string | null;
}

export interface CancelSessionPayload {
  status: 'CANCELLED';
  cancellationReason: string;
}

export interface RescheduleSessionPayload {
  scheduledStart: string;
  scheduledEnd: string;
  room?: string | null;
  isOnline?: boolean;
}

export const sessionDetailQueryKey = (sessionId: string) => ['session-detail', sessionId];