"use client";

import { format, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CalendarHeaderProps {
  activeView: "TIMETABLE" | "CALENDAR";
  onViewChange: (view: "TIMETABLE" | "CALENDAR") => void;
  currentWeekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  activeView,
  onViewChange,
  currentWeekStart,
  onPrevWeek,
  onNextWeek,
  onToday,
}: CalendarHeaderProps) {
  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 0 });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Tabs
        value={activeView}
        onValueChange={(v) => onViewChange(v as "TIMETABLE" | "CALENDAR")}
      >
        <TabsList>
          <TabsTrigger value="TIMETABLE" className="gap-1.5">
            <Clock className="h-4 w-4" /> Weekly Timetable
          </TabsTrigger>
          <TabsTrigger value="CALENDAR" className="gap-1.5">
            <CalendarIcon className="h-4 w-4" /> Session Calendar
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeView === "CALENDAR" && (
        <div className="flex items-center gap-2 border rounded-lg p-1 bg-card">
          <Button variant="ghost" size="sm" onClick={onToday} className="h-8 text-xs font-medium">
            Today
          </Button>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPrevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-xs font-semibold px-2">
            {format(currentWeekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </span>
        </div>
      )}
    </div>
  );
}