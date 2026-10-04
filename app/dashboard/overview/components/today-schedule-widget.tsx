"use client";

import Link from "next/link";
import { Clock, MapPin, Video, CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScheduleSlot } from "@/lib/queries/dashboard";

interface TodayScheduleWidgetProps {
  schedules?: ScheduleSlot[];
  isLoading: boolean;
}

const DAYS_MAP: Record<number, string> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

export function TodayScheduleWidget({ schedules = [], isLoading }: TodayScheduleWidgetProps) {
  const todayDayName = DAYS_MAP[new Date().getDay()];
  
  // Filter for schedules matching today's day of week
  const todaySchedules = schedules.filter(
    (s) => s.dayOfWeek.toUpperCase() === todayDayName
  );

  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Recurring weekly classes scheduled for today.</CardDescription>
        </div>
        <Badge variant="outline">{todaySchedules.length} Classes</Badge>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-full animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : todaySchedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <CalendarCheck className="h-10 w-10 mb-2 stroke-1" />
            <p>No classes scheduled for today ({todayDayName.toLowerCase()}).</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todaySchedules.map((slot) => (
              <div
                key={slot.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base">{slot.group.name}</span>
                    <Badge variant={slot.group.type === "INDIVIDUAL" ? "secondary" : "default"}>
                      {slot.group.type}
                    </Badge>
                    <Badge variant="outline">{slot.group.subject}</Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      {slot.isOnline ? (
                        <>
                          <Video className="h-3.5 w-3.5" /> Online
                        </>
                      ) : (
                        <>
                          <MapPin className="h-3.5 w-3.5" /> {slot.room || "Room TBA"}
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    nativeButton={false}
                    render={
                      <Link href={`/dashboard/groups/${slot.groupId}`}>
                        View Group
                      </Link>
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}