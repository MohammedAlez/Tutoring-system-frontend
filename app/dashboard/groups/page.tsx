import { Suspense } from "react";
import { requireUser } from "@/lib/user";
import { fetchWithAuth } from "@/lib/api";
import { GroupRecord } from "@/lib/queries/groups";
import { GroupsClient } from "./groups-client";
import { Skeleton } from "@/components/ui/skeleton";

export default async function GroupsPage() {
  await requireUser(); // Enforces authentication

  // Server-side initial load for fast first paint
  let initialGroups: GroupRecord[] = [];
  try {
    const res = await fetchWithAuth("/groups?status=ACTIVE");
    if (res.ok) {
      const json = await res.json();
      initialGroups = json.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch initial groups on server:", error);
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Suspense fallback={<GroupsSkeleton />}>
        <GroupsClient initialData={initialGroups} />
      </Suspense>
    </div>
  );
}

function GroupsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-muted rounded animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  );
}