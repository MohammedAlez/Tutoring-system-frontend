// app/dashboard/sessions/_components/session-status-badge.tsx
'use client';

import { SessionStatus } from '@/lib/queries/sessions';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';

interface SessionStatusBadgeProps {
  status: SessionStatus;
}

export function SessionStatusBadge({ status }: SessionStatusBadgeProps) {
  switch (status) {
    case 'SCHEDULED':
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900 dark:text-blue-400 gap-1 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          Scheduled
        </Badge>
      );
    case 'COMPLETED':
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900 dark:text-emerald-400 gap-1 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed
        </Badge>
      );
    case 'CANCELLED':
      return (
        <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-900 dark:text-rose-400 gap-1 font-medium">
          <XCircle className="w-3.5 h-3.5" />
          Cancelled
        </Badge>
      );
    default:
      return null;
  }
}