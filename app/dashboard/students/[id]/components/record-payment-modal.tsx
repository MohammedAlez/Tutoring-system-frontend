"use client";

import { useState } from "react";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiMutation } from "@/hooks/use-api";

interface RecordPaymentModalProps {
  invoiceId: string;
  outstandingBalance: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invalidateQueryKey: readonly unknown[];
}

export function RecordPaymentModal({
  invoiceId,
  outstandingBalance,
  open,
  onOpenChange,
  invalidateQueryKey,
}: RecordPaymentModalProps) {
  const [amount, setAmount] = useState<string>(outstandingBalance.toString());
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [paidAt, setPaidAt] = useState<string>(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState<string>("");

  const recordPaymentMutation = useApiMutation<
    { id: string },
    {
      amount: number;
      paymentMethod: string;
      paidAt?: string;
      note?: string;
    }
  >(
    `/invoices/${invoiceId}/payments`,
    "POST",
    invalidateQueryKey
  );

  const handleSubmit = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    recordPaymentMutation.mutate(
      {
        amount: numericAmount,
        paymentMethod,
        paidAt: paidAt ? new Date(paidAt).toISOString() : undefined,
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Record Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="rounded-lg bg-muted/50 p-3 flex justify-between items-center">
            <span className="text-muted-foreground">Outstanding Balance:</span>
            <span className="font-bold text-foreground text-sm">
              {outstandingBalance.toLocaleString()} DZD
            </span>
          </div>

          <div className="space-y-1.5">
            <Label className="font-semibold">Amount Received (DZD)</Label>
            <Input
              type="number"
              className="text-xs"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={outstandingBalance}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-semibold">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={(value) => (value && setPaymentMethod(value))}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="CCP">CCP</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="font-semibold">Payment Date</Label>
            <Input
              type="date"
              className="text-xs"
              value={paidAt}
              onChange={(e) => setPaidAt(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-semibold">Note (Optional)</Label>
            <Textarea
              className="text-xs resize-none"
              placeholder="Add any receipt details or notes..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={recordPaymentMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={recordPaymentMutation.isPending || !amount}
          >
            {recordPaymentMutation.isPending ? "Recording..." : "Save Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}