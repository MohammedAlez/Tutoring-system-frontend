import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SettingsLoading() {
  return (
    <div className="space-y-6 w-full">
      {/* Page Title & Subtitle Skeleton */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      {/* Account Info Form Card Skeleton */}
      <Card className="border shadow-xs">
        <CardHeader className="space-y-1.5">
          <Skeleton className="h-5 w-44 rounded-md" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Inputs Grid (2x2) */}
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>

          {/* Form Footer Action */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* Security & Password Card Skeleton */}
      <Card className="border shadow-xs">
        <CardHeader className="space-y-1.5">
          <Skeleton className="h-5 w-52 rounded-md" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-3 w-72 rounded-md" />
          </div>
          <Skeleton className="h-10 w-36 rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
}