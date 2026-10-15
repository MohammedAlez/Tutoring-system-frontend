import { Skeleton } from "@/components/ui/skeleton";

export default function ScheduleLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header & Controls Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-56 rounded-md" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>

        {/* Calendar Header Tabs & Date Navigation Skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-10 w-48 rounded-lg hidden sm:block" />
        </div>
      </div>

      {/* 7-Day Columns Grid Skeleton (Timetable / Calendar View) */}
      <div className="grid gap-4 md:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card flex flex-col min-h-[450px] shadow-sm overflow-hidden">
            {/* Day Header */}
            <div className="py-3 px-3 border-b bg-muted/40 text-center space-y-1">
              <Skeleton className="h-3 w-16 mx-auto rounded" />
              <Skeleton className="h-4 w-12 mx-auto rounded" />
            </div>

            {/* Day Content Slots Skeleton */}
            <div className="p-2 space-y-2 flex-1">
              <div className="p-3 rounded-lg border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-3 w-10 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-3 w-3/4 rounded" />
              </div>
              <div className="p-3 rounded-lg border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-3 w-10 rounded-full" />
                </div>
                <Skeleton className="h-4 w-4/5 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}