"use client";

import { Users, UserCheck, Calendar, AlertCircle, Percent, Banknote, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/lib/queries/dashboard";

interface MetricCardGridProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

export function MetricCardGrid({ stats, isLoading }: MetricCardGridProps) {
  const cards = [
    {
      title: "Total Students",
      value: stats?.totalStudents ?? 0,
      icon: Users,
      description: "Enrolled students[cite: 40]",
    },
    {
      title: "Active Students",
      value: stats?.activeStudents ?? 0,
      icon: UserCheck,
      description: "Currently taking classes[cite: 40]",
    },
    {
      title: "Today's Sessions",
      value: stats?.todaySessionsCount ?? 0,
      icon: Calendar,
      description: "Scheduled for today[cite: 40]",
    },
    {
      title: "Unpaid / Overdue",
      value: stats?.unpaidCount ?? 0,
      icon: AlertCircle,
      description: `${(stats?.overdueBalance ?? 0).toLocaleString()} DZD overdue`,
      isWarning: Boolean(stats?.overdueInvoicesCount && stats.overdueInvoicesCount > 0),
    },
    {
      title: "Attendance Rate",
      value: stats ? `${stats.attendanceRate}%` : "0%",
      icon: Percent,
      description: "Average overall rate[cite: 40]",
    },
    {
      title: "Monthly Revenue",
      value: stats ? `${stats.monthlyRevenue.toLocaleString()} DZD` : "0 DZD",
      icon: Banknote,
      description: "Received this month[cite: 40]",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <Card key={i} className={card.isWarning ? "border-amber-500/50 bg-amber-500/5" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-7 w-16 animate-pulse rounded bg-muted" />
              ) : (
                <div className="text-2xl font-bold">{card.value}</div>
              )}
              {/* <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p> */}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}