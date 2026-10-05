"use client";

import { useState, useEffect } from "react";
import { useApiMutation } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
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

interface UpdatePaymentDialogProps {
  payment: {
    id: string;
    amount: number;
    status: string;
    paymentMethod?: string | null;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invalidateQueryKey?: any;
}

export function UpdatePaymentDialog({
  payment,
  open,
  onOpenChange,
  invalidateQueryKey = ["student-details"],
}: UpdatePaymentDialogProps) {
  const [status, setStatus] = useState<string>("PAID");
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");

  // Sync state when payment changes
  useEffect(() => {
    if (payment) {
      setStatus(payment.status || "PAID");
      setPaymentMethod(payment.paymentMethod || "CASH");
    }
  }, [payment]);

  // Use the proxy mutation hook matching edit-payment-modal
  const updateMutation = useApiMutation<
    void,
    { status: string; paymentMethod?: string; paidAt?: string }
  >(
    `/payments/${payment?.id || ""}`,
    "PATCH",
    invalidateQueryKey
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payment) return;

    updateMutation.mutate(
      {
        status,
        paymentMethod: status === "PAID" ? paymentMethod : undefined,
        paidAt: status === "PAID" ? new Date().toISOString() : undefined,
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
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Update Payment Status</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Payment Status</Label>
            <Select
              value={status}
              onValueChange={(val) => {
                if (val) setStatus(val);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PAID">PAID</SelectItem>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="OVERDUE">OVERDUE</SelectItem>
                <SelectItem value="CANCELLED">CANCELLED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status === "PAID" && (
            <div className="space-y-1.5">
              <Label>Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={(val) => {
                  if (val) setPaymentMethod(val);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">CASH</SelectItem>
                  <SelectItem value="CCP">CCP</SelectItem>
                  <SelectItem value="BARIDIMOB">BARIDIMOB</SelectItem>
                  <SelectItem value="BANK_TRANSFER">BANK TRANSFER</SelectItem>
                  <SelectItem value="OTHER">OTHER</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {updateMutation.isError && (
            <p className="text-xs text-destructive font-medium">
              {updateMutation.error?.message || "Failed to update payment"}
            </p>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Update Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}