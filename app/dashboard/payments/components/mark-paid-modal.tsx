// app/dashboard/payments/_components/mark-paid-modal.tsx
'use client';

import { useState } from 'react';
import { useApiMutation } from '@/hooks/use-api';
import { PaymentMethod, PaymentRecord, UpdatePaymentPayload, paymentsQueryKey } from '@/lib/queries/payments';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface MarkPaidModalProps {
  payment: PaymentRecord | null;
  onOpenChange: (open: boolean) => void;
  activeMonth: string;
}

export function MarkPaidModal({ payment, onOpenChange, activeMonth }: MarkPaidModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [note, setNote] = useState('');

  const updateMutation = useApiMutation<void, UpdatePaymentPayload>(
    `/payments/${payment?.id || ''}`,
    'PATCH',
    paymentsQueryKey({ month: activeMonth })
  );

  const handleSettle = () => {
    if (!payment) return;

    updateMutation.mutate(
      {
        status: 'PAID',
        paidAt: new Date().toISOString(),
        paymentMethod: method,
        note: note.trim() || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={!!payment} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
            Settle Payment
          </DialogTitle>
          <DialogDescription>
            Marking pending invoice for {payment?.student.firstName} {payment?.student.lastName} ({payment?.amount} DA) as paid.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={method} onValueChange={(val) => setMethod(val as PaymentMethod)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="CCP">CCP</SelectItem>
                <SelectItem value="BARIDIMOB">BaridiMob</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notes / Receipt Reference</Label>
            <Textarea
              placeholder="e.g. Receipt #1234"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSettle} disabled={updateMutation.isPending} className="bg-emerald-600 hover:bg-emerald-700">
            {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}