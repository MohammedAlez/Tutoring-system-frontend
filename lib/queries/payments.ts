// lib/queries/payments.ts

export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';
export type PaymentMethod = 'CASH' | 'CCP' | 'BARIDIMOB' | 'BANK_TRANSFER' | 'OTHER';

export interface PaymentStudent {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
}

export interface PaymentGroup {
  id: string;
  name: string;
  subject: string;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidAt: string | null;
  periodStart: string;
  periodEnd: string;
  paymentMethod: PaymentMethod | null;
  note: string | null;
  student: PaymentStudent;
  group?: PaymentGroup;
}

export interface PaymentStats {
  totalCollected: number;
  pendingAmount: number;
  overdueAmount: number;
  totalInvoices: number;
}

export interface PaymentsResponse {
  success: boolean;
  data: {
    stats: PaymentStats;
    payments: PaymentRecord[];
  };
}

export interface PaymentsQueryParams {
  status?: PaymentStatus | 'ALL';
  month?: string; // YYYY-MM
  search?: string;
}

export interface CreatePaymentPayload {
  studentId: string;
  groupId?: string;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  periodStart: string;
  periodEnd: string;
  paymentMethod?: PaymentMethod;
  note?: string;
}

export interface UpdatePaymentPayload {
  status?: PaymentStatus;
  paidAt?: string;
  paymentMethod?: PaymentMethod;
  note?: string;
}

export const paymentsQueryKey = (params: PaymentsQueryParams) => [
  'payments',
  params.status || 'ALL',
  params.month || 'current',
  params.search || '',
];

export const buildPaymentsApiPath = (params: PaymentsQueryParams) => {
  const query = new URLSearchParams();
  if (params.status && params.status !== 'ALL') query.append('status', params.status);
  if (params.month) query.append('month', params.month);
  if (params.search) query.append('search', params.search);
  return `/payments?${query.toString()}`;
};