// app/dashboard/payments/page.tsx
import { requireUser } from '@/lib/user';
import { PaymentsClient } from './payments-client';

export default async function PaymentsPage() {
  await requireUser();

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return (
    <div className="container mx-auto p-2 max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Payments & Invoicing Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor recurring invoices, track outstanding balances, and record tuition payment transactions.
        </p>
      </div>

      <PaymentsClient currentMonthStr={currentMonthStr} />
    </div>
  );
}