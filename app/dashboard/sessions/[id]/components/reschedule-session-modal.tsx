// app/dashboard/sessions/_components/reschedule-session-modal.tsx
'use client';

import { useState } from 'react';
import { useApiMutation } from '@/hooks/use-api';
import { sessionDetailQueryKey, RescheduleSessionPayload } from '@/lib/queries/session-detail';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarClock, Loader2 } from 'lucide-react';

interface RescheduleSessionModalProps {
  sessionId: string;
  initialStart: string;
  initialEnd: string;
  initialRoom: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RescheduleSessionModal({
  sessionId,
  initialStart,
  initialEnd,
  initialRoom,
  open,
  onOpenChange,
}: RescheduleSessionModalProps) {
  // Convert ISO string to format required by datetime-local input (YYYY-MM-DDTHH:MM)
  const formatForInput = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [scheduledStart, setScheduledStart] = useState(formatForInput(initialStart));
  const [scheduledEnd, setScheduledEnd] = useState(formatForInput(initialEnd));
  const [room, setRoom] = useState(initialRoom || '');

  const rescheduleMutation = useApiMutation<void, RescheduleSessionPayload>(
    `/sessions/${sessionId}`,
    'PATCH',
    sessionDetailQueryKey(sessionId)
  );

  const handleReschedule = () => {
    rescheduleMutation.mutate(
      {
        scheduledStart: new Date(scheduledStart).toISOString(),
        scheduledEnd: new Date(scheduledEnd).toISOString(),
        room: room.trim() || null,
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-primary" />
            Reschedule Session
          </DialogTitle>
          <DialogDescription>
            Update the date, time slot, or assigned classroom for this session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Date & Time</Label>
            <Input
              id="start-time"
              type="datetime-local"
              value={scheduledStart}
              onChange={(e) => setScheduledStart(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-time">End Date & Time</Label>
            <Input
              id="end-time"
              type="datetime-local"
              value={scheduledEnd}
              onChange={(e) => setScheduledEnd(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-name">Classroom / Room</Label>
            <Input
              id="room-name"
              placeholder="e.g. Room 102"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleReschedule} disabled={rescheduleMutation.isPending}>
            {rescheduleMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save New Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}