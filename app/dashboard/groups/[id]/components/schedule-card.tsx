"use client";

import { Clock, DoorOpen, Trash2, Wifi } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { GroupScheduleSlot, groupKeys } from "@/lib/queries/group";
import { useApiMutation } from "@/hooks/use-api";

interface ScheduleCardProps {
  groupId: string;
  schedule: GroupScheduleSlot;
}

export function ScheduleCard({
  groupId,
  schedule,
}: ScheduleCardProps) {
  const deleteScheduleMutation = useApiMutation<void>(
    `/groups/${groupId}/schedules/${schedule.id}`,
    "DELETE",
    groupKeys.detail(groupId)
  );

  const handleDelete = () => {
    if (
      !confirm(
        "Are you sure you want to delete this weekly recurring time slot?"
      )
    ) {
      return;
    }

    deleteScheduleMutation.mutate(undefined);
  };

  return (
    <Card className="relative group hover:border-primary/50 transition-colors">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="font-bold text-xs uppercase"
          >
            {schedule.dayOfWeek}
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDelete}
            disabled={deleteScheduleMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold font-mono text-primary">
          <Clock className="h-4 w-4" />
          {schedule.startTime} - {schedule.endTime}
        </div>

        <div className="text-xs text-muted-foreground">
          {schedule.isOnline ? (
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <Wifi className="h-3.5 w-3.5" />
              Online Session
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <DoorOpen className="h-3.5 w-3.5" />
              {schedule.room || "Room Unassigned"}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
