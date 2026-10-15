import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentsLoading() {
  return (
    <div className="container mx-auto p-2 max-w-7xl space-y-6">
      {/* Page Title & Subtitle Skeleton */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-72 rounded-md" />
        <Skeleton className="h-4 w-full max-w-xl rounded-md" />
      </div>

      {/* Financial Summary Cards Skeleton (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24 rounded-md" />
                <Skeleton className="h-6 w-28 rounded-md" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming / Overdue Attention Widget Skeleton */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3 shadow-sm">
        <Skeleton className="h-5 w-64 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-background rounded-lg p-3 border space-y-2 shadow-sm">
              <div className="flex justify-between items-start">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-24 rounded-md" />
              <div className="flex justify-between items-center pt-1">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters & Search Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Status Tabs Skeleton */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-16 rounded-md" />
            ))}
          </div>

          {/* Search Input Skeleton */}
          <Skeleton className="h-9 w-48 rounded-md" />

          {/* Month Picker Skeleton */}
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>

      {/* Invoices Table Skeleton */}
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        {/* Table Header Skeleton */}
        <div className="p-3.5 bg-muted/50 border-b grid grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full rounded-md" />
          ))}
        </div>

        {/* Table Rows Skeleton */}
        <div className="divide-y">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="p-4 grid grid-cols-8 gap-4 items-center">
              <div className="space-y-1">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
              </div>
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}