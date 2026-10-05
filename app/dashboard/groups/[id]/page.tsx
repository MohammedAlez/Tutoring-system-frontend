import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/user";
import { fetchWithAuth } from "@/lib/api";
import { GroupDetail } from "@/lib/queries/group";
import { GroupDetailClient } from "./group-detail-client";
import { Skeleton } from "@/components/ui/skeleton";

interface GroupDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function GroupDetailPage({ params }: GroupDetailPageProps) {
  await requireUser(); // Enforce auth[cite: 10]
  const { id: groupId } = await params;

  let initialGroup: GroupDetail | null = null;
  try {
    const res = await fetchWithAuth(`/groups/${groupId}`); // Endpoint from docs
    console.log("Group detail response status:", res.status);
    if (res.ok) {
      const json = await res.json();
      initialGroup = json.data;
    }
  } catch (err) {
    console.error("Failed to fetch group details:", err);
  }

  if (!initialGroup) {
    return notFound();
  }

  return (
    <div className="container mx-auto p-2 space-y-6">
      <Suspense fallback={<GroupDetailSkeleton />}>
        <GroupDetailClient groupId={groupId} initialGroup={initialGroup} />
      </Suspense>
    </div>
  );
}

function GroupDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-10 w-96 rounded-lg" />
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}