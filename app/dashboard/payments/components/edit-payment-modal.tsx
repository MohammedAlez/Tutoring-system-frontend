// app/dashboard/payments/_components/edit-payment-modal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useApiMutation } from '@/hooks/use-api';
import {
  PaymentMethod,
  PaymentRecord,
  PaymentStatus,
  UpdatePaymentPayload,
  paymentsQueryKey,
} from '@/lib/queries/payments';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Loader2 } from 'lucide-react';

interface EditPaymentModalProps {
  payment: PaymentRecord | null;
  onOpenChange: (open: boolean) => void;
  activeMonth: string;
}

export function EditPaymentModal({ payment, onOpenChange, activeMonth }: EditPaymentModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [status, setStatus] = useState<PaymentStatus>('PENDING');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [note, setNote] = useState('');

  // Pre-fill form when a payment is selected for editing
  useEffect(() => {
    if (payment) {
      setAmount(payment.amount);
      setStatus(payment.status);
      setPaymentMethod(payment.paymentMethod || 'CASH');
      setPeriodStart(payment.periodStart ? payment.periodStart.slice(0, 10) : '');
      setPeriodEnd(payment.periodEnd ? payment.periodEnd.slice(0, 10) : '');
      setNote(payment.note || '');
    }
  }, [payment]);

  const updateMutation = useApiMutation<void, UpdatePaymentPayload & { amount?: number; periodStart?: string; periodEnd?: string }>(
    `/payments/${payment?.id || ''}`,
    'PATCH',
    paymentsQueryKey({ month: activeMonth })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payment) return;

    updateMutation.mutate(
      {
        amount: Number(amount),
        status,
        paymentMethod: status === 'PAID' ? paymentMethod : undefined,
        paidAt: status === 'PAID' ? payment.paidAt || new Date().toISOString() : undefined,
        periodStart,
        periodEnd,
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
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-primary" />
            Edit Payment Record
          </DialogTitle>
          <DialogDescription>
            Update payment details for {payment?.student.firstName} {payment?.student.lastName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Amount & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount (DA)</Label>
              <Input
                id="edit-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(val) => setStatus(val as PaymentStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="OVERDUE">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Method */}
          {status === 'PAID' && (
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CCP">CCP</SelectItem>
                  <SelectItem value="BARIDIMOB">BaridiMob</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Billing Period Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-periodStart">Period Start</Label>
              <Input
                id="edit-periodStart"
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-periodEnd">Period End</Label>
              <Input
                id="edit-periodEnd"
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
              />
            </div>
          </div>

          {/* Note / Remarks */}
          <div className="space-y-2">
            <Label htmlFor="edit-note">Notes / Receipt Reference</Label>
            <Textarea
              id="edit-note"
              placeholder="Add payment notes or receipt details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}