// app/dashboard/sessions/_components/cancel-session-modal.tsx
'use client';

import { useState } from 'react';
import { useApiMutation } from '@/hooks/use-api';
import { sessionDetailQueryKey, CancelSessionPayload } from '@/lib/queries/session-detail';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';

interface CancelSessionModalProps {
  sessionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelSessionModal({ sessionId, open, onOpenChange }: CancelSessionModalProps) {
  const [reason, setReason] = useState('');

  const cancelMutation = useApiMutation<void, CancelSessionPayload>(
    `/sessions/${sessionId}`,
    'PATCH',
    sessionDetailQueryKey(sessionId)
  );

  const handleCancel = () => {
    if (!reason.trim()) return;

    cancelMutation.mutate(
      {
        status: 'CANCELLED',
        cancellationReason: reason.trim(),
      },
      {
        onSuccess: () => {
          setReason('');
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Cancel Teaching Session
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this session? This action will mark the session as cancelled and record your reason.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Label htmlFor="cancel-reason">Reason for cancellation</Label>
          <Textarea
            id="cancel-reason"
            placeholder="e.g. Teacher unavailable, National holiday, Emergency..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep Session
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={!reason.trim() || cancelMutation.isPending}
          >
            {cancelMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}