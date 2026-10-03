"use client";

import { DoorOpen, Wifi, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RecurringScheduleRule } from "@/lib/queries/schedule";

interface WeeklyTimetableProps {
  rules: RecurringScheduleRule[];
  isLoading: boolean;
}

const DAYS_OF_WEEK = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

export function WeeklyTimetable({ rules, isLoading }: WeeklyTimetableProps) {
  if (isLoading) {
    return <Skeleton className="h-[500px] w-full rounded-xl" />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-7">
      {DAYS_OF_WEEK.map((day) => {
        const dayRules = rules.filter((r) => r.dayOfWeek === day);

        return (
          <Card key={day} className="flex flex-col min-h-[350px]">
            <CardHeader className="py-3 px-3 border-b bg-muted/40">
              <CardTitle className="text-xs font-bold text-center tracking-wider text-muted-foreground uppercase">
                {day}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-2 flex-1">
              {dayRules.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[11px] text-muted-foreground/60 italic text-center py-8">
                  Free Day
                </div>
              ) : (
                dayRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-2.5 rounded-lg border bg-card hover:border-primary/50 transition-colors space-y-1.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-primary">
                        {rule.startTime} - {rule.endTime}
                      </span>
                      <Badge variant="outline" className="text-[9px] px-1 py-0">
                        {rule.group.type}
                      </Badge>
                    </div>

                    <p className="font-semibold text-xs leading-tight">{rule.group.name}</p>

                    <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" /> {rule.group.subject} ({rule.group.level})
                      </span>
                      {rule.isOnline ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                          <Wifi className="h-3 w-3" /> Online
                        </span>
                      ) : (
                        rule.room && (
                          <span className="flex items-center gap-1">
                            <DoorOpen className="h-3 w-3" /> {rule.room}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}