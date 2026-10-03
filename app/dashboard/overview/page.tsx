"use client";

import { MetricCardGrid } from "./components/metric-card-grid";
import { TodaySessionsWidget } from "./components/today-sessions-widget";
import { UnpaidStudentsWidget } from "./components/unpaid-students-widget";
import { QuickActionButtonGroup } from "./components/quick-action-button-group";
import { 
  useDashboardStats, 
  useSessions, 
  usePayments 
} from "@/lib/queries/dashboard";

export default function DashboardPage() {
  const todayFormatted = new Date().toISOString().split("T")[0];

  // Client-side fetching via proxy hooks
  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
  const { data: sessionsData, isLoading: isLoadingSessions } = useSessions(todayFormatted);
  const { data: paymentsData, isLoading: isLoadingPayments } = usePayments("PENDING", 5);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tutor Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your active students, today's schedule, and pending payments.
          </p>
        </div>
        <QuickActionButtonGroup />
      </div>

      <MetricCardGrid 
        stats={stats} 
        isLoading={isLoadingStats} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <TodaySessionsWidget 
          sessions={sessionsData?.data} 
          isLoading={isLoadingSessions} 
        />
        <UnpaidStudentsWidget
          payments={paymentsData?.data}
          totalOutstanding={paymentsData?.totalOutstanding}
          isLoading={isLoadingPayments}
        />
      </div>
    </div>
  );
}