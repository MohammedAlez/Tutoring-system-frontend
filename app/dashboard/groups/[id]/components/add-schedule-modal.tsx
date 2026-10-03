"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useApiMutation } from "@/hooks/use-api";
import { groupKeys } from "@/lib/queries/groups";

interface AddScheduleModalProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddScheduleModal({ groupId, open, onOpenChange }: AddScheduleModalProps) {
  const [dayOfWeek, setDayOfWeek] = useState<string>("SUNDAY");
  const [startTime, setStartTime] = useState("17:00");
  const [endTime, setEndTime] = useState("19:00");
  const [room, setRoom] = useState("");
  const [isOnline, setIsOnline] = useState(false);

  // Add schedule mutation[cite: 10, 15]
  const addScheduleMutation = useApiMutation<void, {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    room?: string;
    isOnline: boolean;
  }>(
    `/groups/${groupId}/schedules`, // Endpoint from docs[cite: 15]
    "POST",
    groupKeys.detail(groupId)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addScheduleMutation.mutate(
      {
        dayOfWeek,
        startTime,
        endTime,
        room: isOnline ? undefined : room,
        isOnline,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Weekly Recurring Time Slot</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Day of Week</Label>
            <Select 
                value={dayOfWeek} 
                onValueChange={(val) => setDayOfWeek(val ?? "")}
                >
                <SelectTrigger className="text-xs">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((day) => (
                    <SelectItem key={day} value={day} className="text-xs">
                        {day}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Start Time</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">End Time</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label className="text-xs font-semibold cursor-pointer" htmlFor="online-toggle">
              Online Meeting
            </Label>
            <Switch id="online-toggle" checked={isOnline} onCheckedChange={setIsOnline} />
          </div>

          {!isOnline && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Room / Classroom</Label>
              <Input
                placeholder="e.g. Room 102"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="text-xs"
              />
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={addScheduleMutation.isPending}>
              {addScheduleMutation.isPending ? "Adding..." : "Save Time Slot"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}