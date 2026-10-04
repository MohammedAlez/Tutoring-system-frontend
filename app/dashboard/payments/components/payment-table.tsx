// app/dashboard/payments/_components/payment-table.tsx
'use client';

import { PaymentRecord } from '@/lib/queries/payments';
import { PaymentStatusBadge } from './payment-status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Edit2, Phone } from 'lucide-react';

interface PaymentTableProps {
  payments: PaymentRecord[];
  isLoading: boolean;
  onSettle: (payment: PaymentRecord) => void;
  onEdit?: (payment: PaymentRecord) => void; // <--- Made optional (?) to prevent runtime breakage
}

export function PaymentTable({ payments, isLoading, onSettle, onEdit }: PaymentTableProps) {
  return (
    <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Student</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Billing Period</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Method</TableHead>
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
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                No payment records found for the selected criteria.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((p) => {
              const startDate = new Date(p.periodStart).toLocaleDateString([], { month: 'short', day: 'numeric' });
              const endDate = new Date(p.periodEnd).toLocaleDateString([], { month: 'short', day: 'numeric' });

              return (
                <TableRow key={p.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <div>
                      {p.student.firstName} {p.student.lastName}
                      {p.student.phone && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" /> {p.student.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground text-xs">
                    {p.group?.name || 'General Tuition'}
                  </TableCell>

                  <TableCell className="font-bold text-foreground">
                    {p.amount.toLocaleString()} DA
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    {startDate} - {endDate}
                  </TableCell>

                  <TableCell>
                    <PaymentStatusBadge status={p.status} />
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    {p.paymentMethod || '—'}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {p.status !== 'PAID' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSettle(p)}
                          className="gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Settle
                        </Button>
                      )}

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit?.(p)} // <--- Safely invoke with optional chaining
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Edit Payment Record"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
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