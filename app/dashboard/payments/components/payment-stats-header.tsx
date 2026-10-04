// app/dashboard/payments/_components/payment-stats-header.tsx
'use client';

import { PaymentStats } from '@/lib/queries/payments';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Clock, AlertCircle, FileText } from 'lucide-react';

interface PaymentStatsHeaderProps {
  stats?: PaymentStats;
  isLoading: boolean;
}

export function PaymentStatsHeader({ stats, isLoading }: PaymentStatsHeaderProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Collected',
      value: `${(stats?.totalCollected || 0).toLocaleString()} DA`,
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-500/10',
    },
    {
      title: 'Pending Amount',
      value: `${(stats?.pendingAmount || 0).toLocaleString()} DA`,
      icon: Clock,
      color: 'text-amber-600 bg-amber-500/10',
    },
    {
      title: 'Overdue Amount',
      value: `${(stats?.overdueAmount || 0).toLocaleString()} DA`,
      icon: AlertCircle,
      color: 'text-rose-600 bg-rose-500/10',
    },
    {
      title: 'Total Invoices',
      value: stats?.totalInvoices || 0,
      icon: FileText,
      color: 'text-blue-600 bg-blue-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
                <h3 className="text-xl font-bold mt-1 text-foreground">{card.value}</h3>
              </div>
              <div className={`p-2.5 rounded-xl ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}