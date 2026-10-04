// app/dashboard/sessions/page.tsx
import { requireUser } from '@/lib/user'; //[cite: 10]
import { SessionsClient } from './sessions-client';

export default async function SessionsPage() {
  await requireUser(); //[cite: 10]

  // Formatted YYYY-MM-DD string for today's date
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="container mx-auto p-2 max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Session & Attendance Center
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage daily group teaching sessions, record student attendance, or handle reschedules.
        </p>
      </div>

      <SessionsClient todayStr={todayStr} />
    </div>
  );
}