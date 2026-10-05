// lib/queries/student-detail.ts
import { useApiQuery, useApiMutation } from "@/hooks/use-api";
import { studentKeys } from "./students";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
export type PaymentStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "CCP" | "OTHER";

export interface StudentGroupDetail {
  id: string;
  groupId: string;
  joinedAt: string;
  group: {
    id: string;
    name: string;
    subject: string | null;
    level: string | null;
    room: string | null;
    isOnline: boolean;
    status: string;
  };
}

export interface StudentAttendanceRecord {
  id: string;
  sessionId: string;
  status: AttendanceStatus;
  note: string | null;
  createdAt: string;
  session: {
    id: string;
    scheduledStart: string;
    scheduledEnd: string;
    group: {
      id: string;
      name: string;
    };
  };
}

export interface StudentPaymentRecord {
  id: string;
  amount: string;
  status: PaymentStatus;
  dueDate: string | null;
  paidAt: string | null;
  paymentMethod: PaymentMethod | null;
  periodStart: string | null;
  periodEnd: string | null;
  note: string | null;
}

export interface StudentDetail {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  parentName: string | null;
  parentPhone: string | null;
  level: string | null;
  school: string | null;
  subject: string | null;
  enrollmentDate: string;
  status: "ACTIVE" | "INACTIVE";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  groupStudents: StudentGroupDetail[];
  attendance: StudentAttendanceRecord[];
  payments: StudentPaymentRecord[];
}

// Hooks using /api/proxy and query keys
export function useStudentDetail(id: string) {
  return useApiQuery<StudentDetail>(
    // studentKeys.detail(id),
    ['student-details'] as readonly[string], 
    `/students/${id}`,
  );
}

export function useUpdateStudentProfile(id: string) {
  return useApiMutation<Partial<StudentDetail>, Partial<StudentDetail>>(
    `/students/${id}`,
    "PATCH",
    studentKeys.detail(id)
  );
}

export function useEnrollStudent(studentId: string) {
  return useApiMutation<unknown, { groupId: string }>(
    `/groups`,
    "POST",
    studentKeys.detail(studentId)
  );
}

export function useUnenrollStudent(studentId: string, groupId: string) {
  return useApiMutation<unknown, void>(
    `/groups/${groupId}/students/${studentId}`,
    "DELETE",
    studentKeys.detail(studentId)
  );
}

export function useMarkPaymentPaid(studentId: string, paymentId: string) {
  return useApiMutation<StudentPaymentRecord, { status: "PAID"; paymentMethod: PaymentMethod; paidAt: string }>(
    `/payments/${paymentId}`,
    "PATCH",
    studentKeys.detail(studentId)
  );
}