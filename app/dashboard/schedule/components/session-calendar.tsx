"use client";

import { useState } from "react";
import { addDays, format, isSameDay } from "date-fns";
import { DoorOpen, Wifi, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScheduledSession } from "@/lib/queries/schedule";
import { SessionDetailDialog } from "./session-detail-dialog";

interface SessionCalendarProps {
  sessions: ScheduledSession[];
  weekStart: Date;
  isLoading: boolean;
}

export function SessionCalendar({ sessions, weekStart, isLoading }: SessionCalendarProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  if (isLoading) {
    return <Skeleton className="h-[500px] w-full rounded-xl" />;
  }

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const getStatusBadge = (status: ScheduledSession["status"]) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-emerald-600/10 text-emerald-600 border-emerald-600/20 text-[9px] gap-1">
            <CheckCircle className="h-2.5 w-2.5" /> Done
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive" className="text-[9px] gap-1">
            <XCircle className="h-2.5 w-2.5" /> Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[9px] gap-1">
            <Clock className="h-2.5 w-2.5" /> Scheduled
          </Badge>
        );
    }
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-7">
        {weekDays.map((day) => {
          const daySessions = sessions.filter((s) => isSameDay(new Date(s.scheduledStart), day));

          return (
            <Card key={day.toISOString()} className="flex flex-col min-h-[380px]">
              <CardHeader className="py-2.5 px-3 border-b bg-muted/30 text-center">
                <CardTitle className="text-xs font-semibold text-muted-foreground">
                  {format(day, "EEE")}
                </CardTitle>
                <p className="text-sm font-bold">{format(day, "d MMM")}</p>
              </CardHeader>

              <CardContent className="p-2 space-y-2 flex-1">
                {daySessions.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[11px] text-muted-foreground/60 italic py-8">
                    No sessions
                  </div>
                ) : (
                  daySessions.map((session) => {
                    const startStr = format(new Date(session.scheduledStart), "HH:mm");
                    const endStr = format(new Date(session.scheduledEnd), "HH:mm");

                    return (
                      <div
                        key={session.id}
                        onClick={() => setSelectedSessionId(session.id)}
                        className="p-2 rounded-lg border bg-card hover:border-primary cursor-pointer transition-all space-y-1.5 shadow-sm text-left"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-primary">
                            {startStr} - {endStr}
                          </span>
                          {getStatusBadge(session.status)}
                        </div>

                        <p className="font-semibold text-xs leading-tight line-clamp-2">
                          {session.groupName}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                          <span>{session.subject}</span>
                          {session.isOnline ? (
                            <Wifi className="h-3 w-3 text-emerald-600" />
                          ) : (
                            session.room && (
                              <span className="flex items-center gap-0.5">
                                <DoorOpen className="h-3 w-3" /> {session.room}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedSessionId && (
        <SessionDetailDialog
          sessionId={selectedSessionId}
          open={!!selectedSessionId}
          onOpenChange={(open) => !open && setSelectedSessionId(null)}
        />
      )}
    </>
  );
}