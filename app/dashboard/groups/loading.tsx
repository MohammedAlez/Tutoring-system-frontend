import { Skeleton } from "@/components/ui/skeleton";

export default function GroupsLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
              <div className="rounded-xl border  p-5   w-60 h-10">

        <Skeleton className="h-10 w-20 rounded-xl" />
        </div>
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between -mt-20">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-md" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <Skeleton className="h-10 w-40 rounded-md self-start sm:self-auto" />
      </div>

      {/* Filters Bar & Search Skeleton */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Type Filter Tabs Skeleton */}
        <div className="flex items-center gap-2 bg-card border rounded-2xl p-1.5 w-full sm:w-72 shadow-sm">
          <Skeleton className="h-10 w-30 rounded-xl" />
          <Skeleton className="h-10 w-30 rounded-xl" />
          <Skeleton className="h-10 w-34 rounded-xl" />
        </div>

        {/* Search Input Skeleton */}
        <Skeleton className="h-10 w-full sm:w-72 rounded-md" />
      </div>

      {/* Group Cards Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5 space-y-4 shadow-sm flex flex-col justify-between h-52">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>
              <Skeleton className="h-6 w-3/4 rounded-md pt-1" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>

            <div className="pt-3 border-t flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}