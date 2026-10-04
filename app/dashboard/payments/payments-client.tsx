// app/dashboard/payments/payments-client.tsx
'use client';

import { useState } from 'react';
import { useApiQuery } from '@/hooks/use-api';
import {
  PaymentRecord,
  PaymentStatus,
  PaymentsResponse,
  buildPaymentsApiPath,
  paymentsQueryKey,
} from '@/lib/queries/payments';
import { PaymentStatsHeader } from './components/payment-stats-header';
import { PaymentTable } from './components/payment-table';
import { RecordPaymentModal } from './components/record-payment-modal';
import { MarkPaidModal } from './components/mark-paid-modal';
import { EditPaymentModal } from './components/edit-payment-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Calendar } from 'lucide-react';

export function PaymentsClient({ currentMonthStr }: { currentMonthStr: string }) {
  const [activeMonth, setActiveMonth] = useState<string>(currentMonthStr);
  const [activeTab, setActiveTab] = useState<PaymentStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [settlePayment, setSettlePayment] = useState<PaymentRecord | null>(null);
  const [editPayment, setEditPayment] = useState<PaymentRecord | null>(null);

  const queryParams = {
    month: activeMonth,
    status: activeTab,
    search,
  };

  const { data: response, isLoading } = useApiQuery<PaymentsResponse>(
    paymentsQueryKey(queryParams),
    buildPaymentsApiPath(queryParams)
  );

  const payments = response?.data.payments || [];
  const stats = response?.data.stats;

  return (
    <div className="space-y-6">
      {/* Top Header & Summary Stats */}
      <PaymentStatsHeader stats={stats} isLoading={isLoading} />

      {/* Actions Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as PaymentStatus | 'ALL')}
            className="w-full sm:w-auto"
          >
            <TabsList>
              <TabsTrigger value="ALL">All</TabsTrigger>
              <TabsTrigger value="PENDING">Pending / Overdue</TabsTrigger>
              <TabsTrigger value="PAID">Paid</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Input
              type="month"
              value={activeMonth}
              onChange={(e) => setActiveMonth(e.target.value)}
              className="w-auto h-9"
            />
          </div>
        </div>

        <Button onClick={() => setRecordModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Record Payment
        </Button>
      </div>

      {/* Main Table */}
      <PaymentTable
        payments={payments}
        isLoading={isLoading}
        onSettle={(p) => setSettlePayment(p)}
        onEdit={(p) => setEditPayment(p)}
      />

      {/* Modals */}
      <RecordPaymentModal
        open={recordModalOpen}
        onOpenChange={setRecordModalOpen}
        activeMonth={activeMonth}
      />

      <MarkPaidModal
        payment={settlePayment}
        onOpenChange={(open) => !open && setSettlePayment(null)}
        activeMonth={activeMonth}
      />

      <EditPaymentModal
        payment={editPayment}
        onOpenChange={(open) => !open && setEditPayment(null)}
        activeMonth={activeMonth}
      />
    </div>
  );
}