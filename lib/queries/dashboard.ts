// lib/queries/dashboard.ts
import { useApiQuery } from "@/hooks/use-api";

// --- API Response Envelopes ---
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// --- Data Models ---
export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  todaySessionsCount: number;
  unpaidCount: number;
  attendanceRate: number;
  monthlyRevenue: number;
}

export interface ScheduleSlot {
  id: string;
  tutorId: string;
  groupId: string;
  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  startTime: string;
  endTime: string;
  room: string | null;
  isOnline: boolean;
  group: {
    id: string;
    name: string;
    type: "GROUP" | "INDIVIDUAL" | string;
    subject: string;
    level: string;
  };
}

export interface PendingPayment {
  id: string;
  studentId: string;
  amount: number;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  dueDate: string;
  paidAt?: string | null;
  periodStart?: string | null;
  periodEnd?: string | null;
  paymentMethod?: string | null;
  note?: string | null;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
  };
  group?: {
    id: string;
    name: string;
    subject: string;
  } | null;
}

export interface PaymentsData {
  stats: {
    totalCollected: number;
    pendingAmount: number;
    overdueAmount: number;
    totalInvoices: number;
  };
  payments: PendingPayment[];
}

// --- Hooks ---

/** Fetches overall stats for MetricCardGrid */
export function useDashboardStats() {
  return useApiQuery<DashboardStats>(
    ["dashboard-stats"],
    "/dashboard-stats"
  );
}

/** Fetches weekly recurring schedule slots */
export function useTodaySchedule() {
  return useApiQuery<ApiResponse<ScheduleSlot[]>>(
    ["schedules"],
    "/schedules"
  );
}

/** Fetches pending payment records and aggregated financial stats */
export function usePendingPayments(limit: number = 5) {
  return useApiQuery<ApiResponse<PaymentsData>>(
    ["payments", "PENDING", limit],
    `/payments?status=PENDING&limit=${limit}`
  );
}