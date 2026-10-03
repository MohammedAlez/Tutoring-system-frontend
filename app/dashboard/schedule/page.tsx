import { Suspense } from "react";
import { requireUser } from "@/lib/user";
import { fetchWithAuth } from "@/lib/api";
import { RecurringScheduleRule } from "@/lib/queries/schedule";
import { ScheduleClient } from "./schedule-client";
import { Skeleton } from "@/components/ui/skeleton";

export default async function SchedulePage() {
  await requireUser(); // Enforce authenticated access[cite: 10]

  let initialTimetable: RecurringScheduleRule[] = [];
  try {
    const res = await fetchWithAuth("/schedules"); // Endpoint from docs
    if (res.ok) {
      const json = await res.json();
      initialTimetable = json.data || [];
    }
  } catch (err) {
    console.error("Failed to fetch recurring schedules:", err);
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Suspense fallback={<ScheduleSkeleton />}>
        <ScheduleClient initialTimetable={initialTimetable} />
      </Suspense>
    </div>
  );
}

function ScheduleSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-64 bg-muted rounded animate-pulse" />
      <Skeleton className="h-[600px] w-full rounded-xl" />
    </div>
  );
}