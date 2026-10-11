'use client';

import { useApiQuery } from '@/hooks/use-api';
import { paymentKeys, PaymentSummary } from '@/lib/queries/payments';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export function PaymentStatsHeader() {
  const { data: response, isLoading } = useApiQuery<{ data: PaymentSummary }>(
    paymentKeys.summary(),
    '/payments/summary'
  );

  const stats = response?.data;

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
      value: `${Number(stats?.collected || 0).toLocaleString()} DZD`,
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-500/10',
    },
    {
      title: 'Outstanding Balance',
      value: `${Number(stats?.outstanding || 0).toLocaleString()} DZD`,
      icon: DollarSign,
      color: 'text-blue-600 bg-blue-500/10',
    },
    {
      title: 'Overdue Amount',
      value: `${Number(stats?.overdue || 0).toLocaleString()} DZD`,
      icon: AlertCircle,
      color: 'text-rose-600 bg-rose-500/10',
    },
    {
      title: `Due in Next ${stats?.dueSoonDays || 7} Days`,
      value: `${Number(stats?.dueSoon || 0).toLocaleString()} DZD`,
      icon: Clock,
      color: 'text-amber-600 bg-amber-500/10',
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