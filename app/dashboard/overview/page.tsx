// app/dashboard/page.tsx
"use client";

import { MetricCardGrid } from "./components/metric-card-grid";
import { TodayScheduleWidget } from "./components/today-schedule-widget";
import { UnpaidStudentsWidget } from "./components/unpaid-students-widget";
import { QuickActionButtonGroup } from "./components/quick-action-button-group";
import { 
  useDashboardStats, 
  useTodaySchedule, 
  usePendingPayments 
} from "@/lib/queries/dashboard";

export default function DashboardPage() {
  // Client-side fetching via proxy hooks following the tools usage guide
  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
  const { data: scheduleData, isLoading: isLoadingSchedule } = useTodaySchedule();
  const { data: paymentsResponse, isLoading: isLoadingPayments } = usePendingPayments(5);

  console.log("scheduleData:", scheduleData);
  console.log("paymentsResponse:", paymentsResponse);
  return (
    <div className="space-y-6 p-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tutor Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of active students, today's schedule, and pending payments.
          </p>
        </div>
        <QuickActionButtonGroup />
      </div>

      <MetricCardGrid 
        stats={stats} 
        isLoading={isLoadingStats} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <TodayScheduleWidget 
          schedules={scheduleData?.data} 
          isLoading={isLoadingSchedule} 
        />
        <UnpaidStudentsWidget
          payments={paymentsResponse?.data.payments}
          totalOutstanding={paymentsResponse?.data.stats.pendingAmount}
          isLoading={isLoadingPayments}
        />
      </div>
    </div>
  );
}