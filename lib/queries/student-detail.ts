// lib/queries/student-detail.ts
import { useApiQuery, useApiMutation } from "@/hooks/use-api";
import { studentKeys } from "./students";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
export type PaymentStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "CCP" | "OTHER";

export interface GroupEnrollment {
  id: string;
  groupId: string;
  studentId: string;
  joinedAt: string;
  leftAt: string | null;
  billingFee: string;
  billingIntervalMonths: number;
  nextBillingDate: string;
  billingEnabled: boolean;
  group: {
    id: string;
    name: string;
    type: string;
    subject: string;
    level: string;
    room?: string;
    isOnline?: boolean;
    status: string;
  };
}

export interface AttendanceRecord {
  id: string;
  status: string;
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

export interface PaymentTransaction {
  id: string;
  amount: number | string;
  paidAt: string;
  paymentMethod: string;
  note?: string;
}

export interface Invoice {
  id: string;
  amount: number | string;
  status: "PENDING" | "PARTIALLY_PAID" | "PAID" | "OVERDUE" | "CANCELLED";
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  description?: string;
  paidAmount: number | string;
  outstandingBalance: number | string;
  payments: PaymentTransaction[];
  enrollment: {
    id: string;
    group: {
      id: string;
      name: string;
      type: string;
    };
  };
}

export interface StudentDetail {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  parentPhone?: string;
  status: string;
  groupStudents: GroupEnrollment[];
  attendance: AttendanceRecord[];
  invoices: Invoice[];
}

// Hooks using /api/proxy and query keys
export function useStudentDetail(id: string) {
  return useApiQuery<StudentDetail>(
    studentKeys.detail(id),
    // ['student-details'] as readonly[string], 
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

// export function useMarkPaymentPaid(studentId: string, paymentId: string) {
//   return useApiMutation<StudentPaymentRecord, { status: "PAID"; paymentMethod: PaymentMethod; paidAt: string }>(
//     `/payments/${paymentId}`,
//     "PATCH",
//     studentKeys.detail(studentId)
//   );
// }




