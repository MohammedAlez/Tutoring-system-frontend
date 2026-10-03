"use client";

import { useState } from "react";
import { addDays, startOfWeek, format, endOfWeek } from "date-fns";
import { useApiQuery } from "@/hooks/use-api";
import { RecurringScheduleRule, ScheduledSession, scheduleKeys } from "@/lib/queries/schedule";
import { CalendarHeader } from "./components/calendar-header";
import { WeeklyTimetable } from "./components/weekly-timetable";
import { SessionCalendar } from "./components/session-calendar";

interface ScheduleClientProps {
  initialTimetable: RecurringScheduleRule[];
}

export function ScheduleClient({ initialTimetable }: ScheduleClientProps) {
  const [activeView, setActiveView] = useState<"TIMETABLE" | "CALENDAR">("TIMETABLE");
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 0 }) // Starts on Sunday
  );

  const startDateStr = format(currentWeekStart, "yyyy-MM-dd");
  const endDateStr = format(endOfWeek(currentWeekStart, { weekStartsOn: 0 }), "yyyy-MM-dd");

  // Fetch recurring rules via proxy
  const { data: timetableData, isLoading: isLoadingTimetable } = useApiQuery<{ data: RecurringScheduleRule[] }>(
    scheduleKeys.timetable,
    "/schedules",
    // { initialData: { data: initialTimetable } }
  );

  // Fetch concrete calendar sessions for selected date range via proxy[cite: 10, 13]
  const { data: sessionsData, isLoading: isLoadingSessions } = useApiQuery<{ data: ScheduledSession[] }>(
    scheduleKeys.sessions(startDateStr, endDateStr),
    `/sessions?startDate=${startDateStr}&endDate=${endDateStr}`,
    // { enabled: activeView === "CALENDAR" }
  );

  const handlePrevWeek = () => setCurrentWeekStart((prev) => addDays(prev, -7));
  const handleNextWeek = () => setCurrentWeekStart((prev) => addDays(prev, 7));
  const handleToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Schedule & Timetable</h1>
          <p className="text-sm text-muted-foreground">
            Manage your weekly recurring availability and active class sessions.
          </p>
        </div>

        <CalendarHeader
          activeView={activeView}
          onViewChange={setActiveView}
          currentWeekStart={currentWeekStart}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onToday={handleToday}
        />
      </div>

      {activeView === "TIMETABLE" ? (
        <WeeklyTimetable
          rules={timetableData?.data || []}
          isLoading={isLoadingTimetable}
        />
      ) : (
        <SessionCalendar
          sessions={sessionsData?.data || []}
          weekStart={currentWeekStart}
          isLoading={isLoadingSessions}
        />
      )}
    </div>
  );
}