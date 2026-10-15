import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function StudentDetailLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Student Header Card Skeleton */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-56 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>

              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-4 w-36 rounded-md" />
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-4 w-36 rounded-md" />
              </div>

              <Skeleton className="h-3.5 w-64 rounded-md" />
            </div>

            <Skeleton className="h-9 w-28 rounded-md self-start md:self-auto" />
          </div>
        </CardContent>
      </Card>

      {/* Group Assignments Card Skeleton */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-lg border bg-card">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-4 w-12 rounded-full" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-3 w-28 rounded-md" />
                    <Skeleton className="h-3 w-20 rounded-md" />
                  </div>
                  <Skeleton className="h-3 w-24 rounded-md" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes Card Skeleton */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <Skeleton className="h-5 w-52 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-28 w-full rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
}