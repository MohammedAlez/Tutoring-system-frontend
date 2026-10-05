"use client";

import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, DoorOpen, Wifi } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiQuery } from "@/hooks/use-api";
import { ScheduledSession } from "@/lib/queries/schedule";

interface GroupSessionsTabProps {
  groupId: string;
}

export function GroupSessionsTab({ groupId }: GroupSessionsTabProps) {
  const { data: response, isLoading } = useApiQuery<{ data: ScheduledSession[] }>(
    ["sessions", "group", groupId],
    `/sessions?groupId=${groupId}` // Endpoint from docs[cite: 15]
  );

  const sessions = response?.data || [];

  console.log("Fetched sessions for group", groupId, sessions);
  if (isLoading) {
    return <Skeleton className="h-[300px] w-full rounded-xl" />;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Session History & Upcoming Log</h3>

      {sessions.length === 0 ? (
        <Card className="py-8 text-center text-sm text-muted-foreground">
          No generated sessions found for this group.
        </Card>
      ) : (
        sessions.map((session) => {
          const start = new Date(session.scheduledStart);
          const end = new Date(session.scheduledEnd);

          return (
            <Card key={session.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{format(start, "EEEE, PPP")}</span>
                    {session.status === "COMPLETED" && (
                      <Badge className="bg-emerald-600/10 text-emerald-600 border-emerald-600/20 text-[10px]">
                        <CheckCircle className="h-3 w-3 mr-1" /> Completed
                      </Badge>
                    )}
                    {session.status === "CANCELLED" && (
                      <Badge variant="destructive" className="text-[10px]">
                        <XCircle className="h-3 w-3 mr-1" /> Cancelled
                      </Badge>
                    )}
                    {session.status === "SCHEDULED" && (
                      <Badge variant="outline" className="text-[10px]">
                        <Clock className="h-3 w-3 mr-1" /> Scheduled
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs font-mono text-muted-foreground">
                    {format(start, "HH:mm")} - {format(end, "HH:mm")}
                  </p>
                </div>

                <div className="text-xs text-muted-foreground">
                  {session.isOnline ? (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <Wifi className="h-3.5 w-3.5" /> Online
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <DoorOpen className="h-3.5 w-3.5" /> {session.room || "Room N/A"}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}