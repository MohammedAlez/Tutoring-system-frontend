"use client";

import Link from "next/link";
import { Clock, MapPin, Video, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Session } from "@/lib/queries/dashboard";

interface TodaySessionsWidgetProps {
  sessions?: Session[];
  isLoading: boolean;
}

export function TodaySessionsWidget({ sessions = [], isLoading }: TodaySessionsWidgetProps) {
  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Today's Sessions</CardTitle>
          <CardDescription>Scheduled classes and individual tutoring sessions.</CardDescription>
        </div>
        <Badge variant="outline">{sessions.length} Sessions</Badge>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-full animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <CheckCircle2 className="h-10 w-10 mb-2 stroke-1" />
            <p>No sessions scheduled for today.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const startTime = new Date(session.scheduledStart).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const endTime = new Date(session.scheduledEnd).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base">{session.group.name}</span>
                      <Badge variant={session.group.type === "INDIVIDUAL" ? "secondary" : "default"}>
                        {session.group.type}
                      </Badge>
                      {session.status === "COMPLETED" && (
                        <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                          Completed
                        </Badge>
                      )}
                      {session.status === "CANCELLED" && (
                        <Badge variant="destructive">Cancelled</Badge>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {startTime} - {endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        {session.isOnline ? (
                          <>
                            <Video className="h-3.5 w-3.5" /> Online
                          </>
                        ) : (
                          <>
                            <MapPin className="h-3.5 w-3.5" /> {session.room || "Room TBA"}
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                    <div className="flex items-center gap-2">
                    {session.status === "SCHEDULED" && (
                        <Button
                        size="sm"
                        render={
                            <Link href={`/dashboard/attendance?sessionId=${session.id}`}>
                            Take Attendance
                            </Link>
                        }
                        />
                    )}
                    {session.status === "COMPLETED" && (
                        <Button
                        size="sm"
                        variant="outline"
                        render={
                            <Link href={`/dashboard/attendance?sessionId=${session.id}`}>
                            View Record
                            </Link>
                        }
                        />
                    )}
                    </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}