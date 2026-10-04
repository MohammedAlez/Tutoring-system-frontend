// app/dashboard/sessions/[id]/page.tsx
import { requireUser } from '@/lib/user';
import { SessionDetailClient } from './session-detail-client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionDetailPage({ params }: PageProps) {
  await requireUser();
  const { id } = await params;

  return (
    <div className="container mx-auto p-2 max-w-7xl">
      <SessionDetailClient sessionId={id} />
    </div>
  );
}