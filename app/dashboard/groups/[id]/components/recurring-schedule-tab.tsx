"use client";

import { useState } from "react";
import { Plus, Trash2, Clock, DoorOpen, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GroupScheduleSlot, groupKeys } from "@/lib/queries/group";
import { useApiMutation } from "@/hooks/use-api";
import { AddScheduleModal } from "./add-schedule-modal";

interface RecurringScheduleTabProps {
  groupId: string;
  schedules: GroupScheduleSlot[];
}

export function RecurringScheduleTab({ groupId, schedules }: RecurringScheduleTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delete recurring schedule mutation accepting dynamic path parameter
  const deleteScheduleMutation = useApiMutation<void, { path: string }>(
    "",
    "DELETE",
    groupKeys.detail(groupId)
  );

  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm("Are you sure you want to delete this weekly recurring time slot?")) {
      deleteScheduleMutation.mutate({
        path: `/groups/${groupId}/schedules/${scheduleId}`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Weekly Recurring Schedules</h3>
          <p className="text-xs text-muted-foreground">
            Weekly slots used to generate class sessions.
          </p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Time Slot
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {schedules.length === 0 ? (
          <Card className="col-span-full py-8 text-center text-sm text-muted-foreground">
            No recurring schedule slots created for this group yet.
          </Card>
        ) : (
          schedules.map((slot) => (
            <Card key={slot.id} className="relative group hover:border-primary/50 transition-colors">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-bold text-xs uppercase">
                    {slot.dayOfWeek}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteSchedule(slot.id)}
                    disabled={deleteScheduleMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold font-mono text-primary">
                  <Clock className="h-4 w-4" />
                  {slot.startTime} - {slot.endTime}
                </div>

                <div className="text-xs text-muted-foreground">
                  {slot.isOnline ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <Wifi className="h-3.5 w-3.5" /> Online Session
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <DoorOpen className="h-3.5 w-3.5" /> {slot.room || "Room Unassigned"}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AddScheduleModal groupId={groupId} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}