'use client';

import { useApiQuery } from '@/hooks/use-api';
import { paymentKeys, UpcomingInvoice } from '@/lib/queries/payments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface UpcomingResponse {
  invoices: UpcomingInvoice[];
  summary: { total: number; overdue: number; dueSoon: number; outstandingAmount: string };
}

export function UpcomingPaymentsWidget() {
  const { data: response, isLoading } = useApiQuery<{ data: UpcomingResponse }>(
    paymentKeys.upcoming(),
    '/payments/upcoming'
  );

  const data = response?.data;
  const invoices = data?.invoices || [];

  if (isLoading || invoices.length === 0) return null;

  return (
    <Card className="border-amber-500/30 bg-amber-500/5 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4" />
          Invoices Requiring Attention ({data?.summary.total})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {invoices.slice(0, 3).map((inv) => {
            const balance = Number(inv.outstandingBalance ?? inv.amount);
            return (
              <div key={inv.id} className="bg-background rounded-lg p-3 border shadow-sm space-y-1.5 text-xs">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-foreground">
                    {inv.student.firstName} {inv.student.lastName}
                  </span>
                  <Badge variant={inv.attentionStatus === 'OVERDUE' ? 'destructive' : 'outline'} className="text-[10px]">
                    {inv.attentionStatus === 'OVERDUE' ? `${inv.daysOverdue}d overdue` : `Due in ${inv.daysUntilDue}d`}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{inv.enrollment?.group?.name || 'General'}</p>
                <div className="flex justify-between items-center pt-1 font-medium">
                  <span>Balance Due:</span>
                  <span className="text-foreground font-bold">{balance.toLocaleString()} DZD</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}