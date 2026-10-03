"use client";

import { useState } from "react";
import { CreditCard, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudentPaymentRecord } from "@/lib/queries/student-detail";
import { UpdatePaymentDialog } from "./UpdatePaymentDialog";

interface PaymentHistoryTabProps {
  studentId: string;
  payments: StudentPaymentRecord[];
}

export function PaymentHistoryTab({ payments = [] }: PaymentHistoryTabProps) {
  const [selectedPayment, setSelectedPayment] = useState<StudentPaymentRecord | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-emerald-600/10 text-emerald-600 border-emerald-600/20">PAID</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="text-amber-600 border-amber-600/20">PENDING</Badge>;
      case "OVERDUE":
        return <Badge variant="destructive">OVERDUE</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground space-y-2">
              <CreditCard className="h-8 w-8 mx-auto text-muted-foreground/50" />
              <p>No payment records found for this student.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Paid At / Due</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-semibold">
                      {Number(payment.amount).toLocaleString()} DZD
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {payment.paymentMethod || "—"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString()
                        : payment.dueDate
                        ? `Due: ${new Date(payment.dueDate).toLocaleDateString()}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                      {payment.note || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Update payment status</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedPayment && (
        <UpdatePaymentDialog
          payment={{
            ...selectedPayment,
            amount: Number(selectedPayment.amount),
          }}
          open={!!selectedPayment}
          onOpenChange={(open) => !open && setSelectedPayment(null)}
        />
      )}
    </>
  );
}