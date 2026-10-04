"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { GroupScheduleSlot } from "@/lib/queries/group";

import { AddScheduleModal } from "./add-schedule-modal";
import { ScheduleCard } from "./schedule-card";

interface RecurringScheduleTabProps {
  groupId: string;
  schedules: GroupScheduleSlot[];
}

export function RecurringScheduleTab({
  groupId,
  schedules,
}: RecurringScheduleTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Weekly Recurring Schedules
          </h3>

          <p className="text-xs text-muted-foreground">
            Weekly slots used to generate class sessions.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Time Slot
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {schedules.length === 0 ? (
          <Card className="col-span-full py-8 text-center text-sm text-muted-foreground">
            No recurring schedule slots created for this group yet.
          </Card>
        ) : (
          schedules.map((slot) => (
            <ScheduleCard
              key={slot.id}
              groupId={groupId}
              schedule={slot}
            />
          ))
        )}
      </div>

      <AddScheduleModal
        groupId={groupId}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
