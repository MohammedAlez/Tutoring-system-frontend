// app/dashboard/page.tsx
"use client";

import { MetricCardGrid } from "./components/metric-card-grid";
import { TodayScheduleWidget } from "./components/today-schedule-widget";
import { UnpaidStudentsWidget } from "./components/unpaid-students-widget";
import { QuickActionButtonGroup } from "./components/quick-action-button-group";
import { 
  useDashboardStats, 
  useTodaySchedule 
} from "@/lib/queries/dashboard";
import { useApiQuery } from "@/hooks/use-api";
import { UpcomingPaymentsResponse } from "@/lib/queries/dashboard";

export default function DashboardPage() {
  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
  const { data: scheduleData, isLoading: isLoadingSchedule } = useTodaySchedule();
  
  // Fetch upcoming/overdue attention invoices directly from /payments/upcoming[cite: 34]
  const { data: upcomingResponse, isLoading: isLoadingPayments } = useApiQuery<{ data: UpcomingPaymentsResponse }>(
    ["payments", "upcoming"],
    "/payments/upcoming"
  );

  const upcomingData = upcomingResponse?.data;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 p-2">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
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

      <div className="grid min-h-0 flex-1 grid-cols-1 items-stretch gap-6 lg:grid-cols-7">
        <TodayScheduleWidget
          schedules={scheduleData?.data}
          isLoading={isLoadingSchedule}
        />

        <UnpaidStudentsWidget
          invoices={upcomingData?.invoices}
          totalOutstanding={upcomingData?.summary.outstandingAmount}
          isLoading={isLoadingPayments}
        />
      </div>
    </div>
  );
}