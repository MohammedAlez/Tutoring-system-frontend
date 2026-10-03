// lib/queries/dashboard.ts
import { useApiQuery } from "@/hooks/use-api";

// ============================================================
// TYPES
// ============================================================

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  todaySessionsCount: number;
  unpaidCount: number;
  attendanceRate: number;
  monthlyRevenue: number;
}

export interface SessionGroup {
  id: string;
  name: string;
  type: "GROUP" | "INDIVIDUAL";
  subject?: string | null;
  level?: string | null;
}

export interface Session {
  id: string;
  groupId: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  room?: string | null;
  isOnline: boolean;
  group: SessionGroup;
}

export interface SessionsResponse {
  data: Session[];
}

export interface PaymentStudent {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  dueDate?: string | null;
  periodStart?: string | null;
  periodEnd?: string | null;
  student: PaymentStudent;
}

export interface PaymentsResponse {
  data: Payment[];
  totalOutstanding: number;
}

// ============================================================
// QUERY KEYS
// ============================================================

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  sessions: (date: string) => [...dashboardKeys.all, "sessions", date] as const,
  payments: (status?: string, limit?: number) =>
    [...dashboardKeys.all, "payments", { status, limit }] as const,
};

// ============================================================
// CLIENT HOOKS (via /api/proxy)
// ============================================================

export function useDashboardStats() {
  return useApiQuery<DashboardStats>(
    dashboardKeys.stats(),
    "/dashboard-stats"
  );
}

export function useSessions(date: string) {
  return useApiQuery<SessionsResponse>(
    dashboardKeys.sessions(date),
    `/sessions?date=${date}`
  );
}

export function usePayments(status = "PENDING", limit = 10) {
  return useApiQuery<PaymentsResponse>(
    dashboardKeys.payments(status, limit),
    `/payments?status=${status}&limit=${limit}`
  );
}