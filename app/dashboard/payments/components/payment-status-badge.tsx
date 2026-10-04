// app/dashboard/payments/_components/payment-status-badge.tsx
'use client';

import { PaymentStatus } from '@/lib/queries/payments';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  switch (status) {
    case 'PAID':
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900 gap-1 font-medium">
          <CheckCircle2 className="w-3 h-3" />
          Paid
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900 gap-1 font-medium">
          <Clock className="w-3 h-3" />
          Pending
        </Badge>
      );
    case 'OVERDUE':
      return (
        <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-900 gap-1 font-medium">
          <AlertTriangle className="w-3 h-3" />
          Overdue
        </Badge>
      );
    default:
      return null;
  }
}