'use client';

import { useState } from 'react';
import { useApiMutation } from '@/hooks/use-api';
import { InvoiceRecord, paymentKeys, PaymentMethod } from '@/lib/queries/payments';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, DollarSign } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface RecordPaymentModalProps {
  invoice: InvoiceRecord | null;
  onOpenChange: (open: boolean) => void;
  filters: Record<string, any>;
}

export function RecordPaymentModal({ invoice, onOpenChange, filters }: RecordPaymentModalProps) {
  const outstanding = Number(invoice?.outstandingBalance ?? invoice?.amount ?? 0);
  const [amount, setAmount] = useState<string>(outstanding.toString());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [paidAt, setPaidAt] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const queryClient = useQueryClient();

  const recordMutation = useApiMutation<
    void,
    { amount: number; paymentMethod: PaymentMethod; paidAt?: string; note?: string }
  >(
    invoice ? `/invoices/${invoice.id}/payments` : '',
    'POST',
    paymentKeys.invoices(filters)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    recordMutation.mutate(
      {
        amount: val,
        paymentMethod,
        paidAt: paidAt ? new Date(paidAt).toISOString() : undefined,
        note: note.trim() || undefined,
      },
      {
        onSuccess: async() => {
          onOpenChange(false);
          setNote('');
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: paymentKeys.upcoming(),
            }),
            queryClient.invalidateQueries({
              queryKey: paymentKeys.summary(),
            }),
            queryClient.invalidateQueries({
              queryKey: paymentKeys.invoices(filters),
            }),
          ]);
        },
      }
    );
  };

  return (
    <Dialog open={!!invoice} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Record Payment
          </DialogTitle>
          <DialogDescription>
            Record payment received from {invoice?.student.firstName} {invoice?.student.lastName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="rounded-lg bg-muted/50 p-3 flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Outstanding Balance:</span>
            <span className="font-bold text-foreground text-sm">
              {outstanding.toLocaleString()} DZD
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pay-amount">Amount Received (DZD)</Label>
            <Input
              id="pay-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={outstanding}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="CCP">CCP</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paidAt">Payment Date</Label>
            <Input
              id="paidAt"
              type="date"
              value={paidAt}
              onChange={(e) => setPaidAt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pay-note">Note (Optional)</Label>
            <Textarea
              id="pay-note"
              placeholder="Add any receipt details or notes..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={recordMutation.isPending}>
              {recordMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}