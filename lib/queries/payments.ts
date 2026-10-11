export type InvoiceStatus = 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CCP' | 'OTHER';

export interface InvoiceRecord {
  id: string;
  tutorId: string;
  studentId: string;
  enrollmentId: string;
  amount: string;
  status: InvoiceStatus;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  description: string | null;
  paidAmount?: string;
  outstandingBalance?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
  };
  enrollment: {
    id: string;
    group: {
      id: string;
      name: string;
      subject?: string;
      type?: string;
    };
  };
  payments: Array<{
    id: string;
    amount: string;
    paidAt: string;
    paymentMethod: PaymentMethod;
    note?: string | null;
  }>;
}

export interface PaymentSummary {
  collected: string;
  outstanding: string;
  overdue: string;
  dueSoon: string;
  dueSoonDays: number;
  asOf: string;
}

export interface UpcomingInvoice extends InvoiceRecord {
  attentionStatus: 'OVERDUE' | 'DUE_SOON';
  daysUntilDue: number | null;
  daysOverdue: number | null;
}

export const paymentKeys = {
  all: ['payments'] as const,
  summary: () => [...paymentKeys.all, 'summary'] as const,
  upcoming: () => [...paymentKeys.all, 'upcoming'] as const,
  invoices: (filters?: Record<string, any>) => ['invoices', filters] as const,
  invoiceDetail: (id: string) => ['invoices', id] as const,
  transactions: (filters?: Record<string, any>) => [...paymentKeys.all, 'transactions', filters] as const,
};