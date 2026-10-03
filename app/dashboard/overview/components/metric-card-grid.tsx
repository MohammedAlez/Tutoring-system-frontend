"use client";

import { Users, UserCheck, Calendar, AlertCircle, Percent, Banknote } from "lucide-react";
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
      description: "Enrolled students",
    },
    {
      title: "Active Students",
      value: stats?.activeStudents ?? 0,
      icon: UserCheck,
      description: "Currently taking classes",
    },
    {
      title: "Today's Sessions",
      value: stats?.todaySessionsCount ?? 0,
      icon: Calendar,
      description: "Scheduled for today",
    },
    {
      title: "Unpaid Students",
      value: stats?.unpaidCount ?? 0,
      icon: AlertCircle,
      description: "Pending or overdue",
      isWarning: Boolean(stats?.unpaidCount && stats.unpaidCount > 0),
    },
    {
      title: "Attendance Rate",
      value: stats ? `${stats.attendanceRate}%` : "0%",
      icon: Percent,
      description: "Average overall rate",
    },
    {
      title: "Monthly Revenue",
      value: stats ? `${stats.monthlyRevenue.toLocaleString()} DA` : "0 DA",
      icon: Banknote,
      description: "Current month total",
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
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}