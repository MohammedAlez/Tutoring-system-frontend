"use client";

import { useState } from "react";
import { CreditCard, PlusCircle, CheckCircle2 } from "lucide-react";
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
import { Invoice } from "@/lib/queries/student-detail";
import { RecordPaymentModal } from "./record-payment-modal";
import { studentKeys } from "@/lib/queries/students";

interface PaymentHistoryTabProps {
  studentId: string;
  invoices: Invoice[];
}

export function PaymentHistoryTab({ invoices = [], studentId }: PaymentHistoryTabProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-emerald-600/10 text-emerald-600 border-emerald-600/20">PAID</Badge>;
      case "PARTIALLY_PAID":
        return <Badge className="bg-blue-600/10 text-blue-600 border-blue-600/20">PARTIALLY PAID</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="text-amber-600 border-amber-600/20">PENDING</Badge>;
      case "OVERDUE":
        return <Badge variant="destructive">OVERDUE</Badge>;
      case "CANCELLED":
        return <Badge variant="secondary">CANCELLED</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Invoices & Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground space-y-2">
              <CreditCard className="h-8 w-8 mx-auto text-muted-foreground/50" />
              <p>No invoices found for this student.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group / Period</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const balance = Number(invoice.outstandingBalance);
                  const canPay = invoice.status !== "PAID" && invoice.status !== "CANCELLED" && balance > 0;

                  return (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <p className="font-semibold text-xs">{invoice.enrollment?.group?.name || "General"}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(invoice.periodStart).toLocaleDateString()} – {new Date(invoice.periodEnd).toLocaleDateString()}
                        </p>
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {Number(invoice.amount).toLocaleString()} DZD
                      </TableCell>
                      <TableCell className="text-xs text-emerald-600 font-medium">
                        {Number(invoice.paidAmount).toLocaleString()} DZD
                      </TableCell>
                      <TableCell className="text-xs font-bold text-foreground">
                        {balance.toLocaleString()} DZD
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {canPay ? (
                          <Button
                            variant="default"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <PlusCircle className="h-3.5 w-3.5" /> Record Payment
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Settled
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedInvoice && (
        <RecordPaymentModal
          invoiceId={selectedInvoice.id}
          outstandingBalance={Number(selectedInvoice.outstandingBalance)}
          open={!!selectedInvoice}
          onOpenChange={(open) => !open && setSelectedInvoice(null)}
          invalidateQueryKey={studentKeys.detail(studentId)}
        />
      )}
    </>
  );
}