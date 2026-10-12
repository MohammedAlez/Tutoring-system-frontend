'use client';

import { InvoiceRecord } from '@/lib/queries/payments';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, CheckCircle2, Phone, Clock, AlertTriangle, Ban } from 'lucide-react';

interface PaymentTableProps {
  invoices: InvoiceRecord[];
  isLoading: boolean;
  onRecordPayment: (invoice: InvoiceRecord) => void;
}

export function PaymentTable({ invoices, isLoading, onRecordPayment }: PaymentTableProps) {
  const getStatusBadge = (status: InvoiceRecord['status']) => {
    switch (status) {
      case 'PAID':
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 gap-1">
            <CheckCircle2 className="w-3 h-3" /> Paid
          </Badge>
        );
      case 'PARTIALLY_PAID':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 gap-1">
            <Clock className="w-3 h-3" /> Partially Paid
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200 gap-1">
            <Clock className="w-3 h-3" /> Pending
          </Badge>
        );
      case 'OVERDUE':
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-200 gap-1">
            <AlertTriangle className="w-3 h-3" /> Overdue
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground gap-1">
            <Ban className="w-3 h-3" /> Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Student</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Balance Due</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                No invoices found matching the selected criteria.
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((inv) => {
              const amount = Number(inv.amount);
              
              // Sum up all payments from the array, with fallback to paidAmount
              const paid = inv.payments && inv.payments.length > 0
                ? inv.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0)
                : Number(inv.paidAmount ?? 0);

              // Calculate balance due: total amount minus total paid
              const balance = Math.max(0, amount - paid);
              const canPay = inv.status !== 'PAID' && inv.status !== 'CANCELLED' && balance > 0;

              return (
                <TableRow key={inv.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <div>
                      {inv.student.firstName} {inv.student.lastName}
                      {inv.student.phone && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" /> {inv.student.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground text-xs">
                    {inv.enrollment?.group?.name || 'General Tuition'}
                  </TableCell>

                  <TableCell className="font-medium text-foreground">
                    {amount.toLocaleString()} DZD
                  </TableCell>

                  <TableCell className="text-emerald-600 font-medium">
                    {paid.toLocaleString()} DZD
                  </TableCell>

                  <TableCell className="font-bold text-foreground">
                    {balance.toLocaleString()} DZD
                  </TableCell>

                  <TableCell>{getStatusBadge(inv.status)}</TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(inv.dueDate).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    {canPay ? (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onRecordPayment(inv)}
                        className="gap-1.5 h-7 text-xs"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Record Payment
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground flex items-center justify-end gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Settled
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}