'use client';

import { useState } from 'react';
import { useApiQuery } from '@/hooks/use-api';
import { InvoiceRecord, InvoiceStatus, paymentKeys } from '@/lib/queries/payments';
import { PaymentStatsHeader } from './components/payment-stats-header';
import { UpcomingPaymentsWidget } from './components/upcoming-payments-widget';
import { PaymentTable } from './components/payment-table';
import { RecordPaymentModal } from './components/record-payment-modal';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar } from 'lucide-react';

interface InvoicesApiResponse {
  success: boolean;
  data: InvoiceRecord[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export function PaymentsClient({ currentMonthStr }: { currentMonthStr: string }) {
  const [activeMonth, setActiveMonth] = useState<string>(currentMonthStr);
  const [activeTab, setActiveTab] = useState<InvoiceStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  const filters = {
    month: activeMonth || undefined,
    status: activeTab === 'ALL' ? undefined : activeTab,
  };

  const { data: response, isLoading } = useApiQuery<InvoicesApiResponse>(
    paymentKeys.invoices(filters),
    `/invoices?${new URLSearchParams(
      Object.entries({
        ...(filters.month ? { month: filters.month } : {}),
        ...(filters.status ? { status: filters.status } : {}),
      })
    ).toString()}`
  );

  const invoices = response?.data || [];

  // Client-side student name filter if search is active
  const filteredInvoices = invoices.filter((inv) => {
    if (!search.trim()) return true;
    const fullName = `${inv.student.firstName} ${inv.student.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <PaymentStatsHeader />

      {/* Upcoming / Overdue Attention Widget */}
      <UpcomingPaymentsWidget />

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as InvoiceStatus | 'ALL')}
            className="w-full sm:w-auto"
          >
            <TabsList>
              <TabsTrigger value="ALL">All</TabsTrigger>
              <TabsTrigger value="PENDING">Pending</TabsTrigger>
              <TabsTrigger value="PARTIALLY_PAID">Partial</TabsTrigger>
              <TabsTrigger value="OVERDUE">Overdue</TabsTrigger>
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
              className="w-auto h-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <PaymentTable
        invoices={filteredInvoices}
        isLoading={isLoading}
        onRecordPayment={(inv) => setSelectedInvoice(inv)}
      />

      {/* Record Payment Modal */}
      <RecordPaymentModal
        invoice={selectedInvoice}
        onOpenChange={(open) => !open && setSelectedInvoice(null)}
        filters={filters}
      />
    </div>
  );
}