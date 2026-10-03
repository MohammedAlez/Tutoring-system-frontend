"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Clock, DoorOpen, Wifi, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useApiQuery, useApiMutation } from "@/hooks/use-api";
import { ScheduledSession, scheduleKeys } from "@/lib/queries/schedule";

interface SessionDetailDialogProps {
  sessionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionDetailDialog({ sessionId, open, onOpenChange }: SessionDetailDialogProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  // Fetch full session details[cite: 10, 13]
  const { data: response, isLoading } = useApiQuery<{ data: ScheduledSession }>(
    scheduleKeys.sessionDetail(sessionId),
    `/sessions/${sessionId}`,
    // { enabled: open }
  );

  // Mutation to cancel or reschedule[cite: 10, 13]
  const updateSession = useApiMutation<void, { status: string; cancellationReason?: string }>(
    `/sessions/${sessionId}`,
    "PATCH",
    scheduleKeys.all // Invalidates schedule queries on change[cite: 10]
  );

  const session = response?.data;

  const handleCancelSession = () => {
    if (!cancellationReason.trim()) return;

    updateSession.mutate(
      {
        status: "CANCELLED",
        cancellationReason: cancellationReason.trim(),
      },
      {
        onSuccess: () => {
          setIsCancelling(false);
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Session Details</DialogTitle>
        </DialogHeader>

        {isLoading || !session ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading session...</div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <h3 className="font-semibold text-base">{session.groupName}</h3>
              <p className="text-xs text-muted-foreground">
                {session.subject} • {session.level} ({session.groupType})
              </p>
            </div>

            <div className="rounded-lg border p-3 space-y-2 bg-muted/20 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> Date & Time
                </span>
                <span className="font-semibold">
                  {format(new Date(session.scheduledStart), "PPP, HH:mm")} -{" "}
                  {format(new Date(session.scheduledEnd), "HH:mm")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  {session.isOnline ? <Wifi className="h-3.5 w-3.5" /> : <DoorOpen className="h-3.5 w-3.5" />}
                  Location
                </span>
                <span className="font-medium">
                  {session.isOnline ? "Online Meeting" : session.room || "Unassigned"}
                </span>
              </div>
            </div>

            {session.status === "CANCELLED" && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
                <p className="font-semibold flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Session Cancelled
                </p>
                <p>{session.cancellationReason || "No reason provided."}</p>
              </div>
            )}

            {isCancelling && (
              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="reason" className="text-xs font-semibold">
                  Cancellation Reason
                </Label>
                <Textarea
                  id="reason"
                  rows={2}
                  placeholder="e.g. Teacher unavailable due to illness"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {isCancelling ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => setIsCancelling(false)}>
                Back
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancelSession}
                disabled={!cancellationReason.trim() || updateSession.isPending}
              >
                {updateSession.isPending ? "Cancelling..." : "Confirm Cancellation"}
              </Button>
            </>
          ) : (
            session?.status === "SCHEDULED" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsCancelling(true)}
              >
                Cancel Session
              </Button>
            )
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}