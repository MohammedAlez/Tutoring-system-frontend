"use client";

import Link from "next/link";
import { Users, BookOpen, DoorOpen, Calendar, Wifi, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GroupRecord } from "@/lib/queries/groups";

interface GroupCardGridProps {
  groups: GroupRecord[];
  isLoading: boolean;
}

export function GroupCardGrid({ groups, isLoading }: GroupCardGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-52 rounded-xl" />
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-xl bg-card text-center">
        <Users className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <h3 className="font-semibold text-lg">No groups found</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => {
        const studentCount = group._count?.students ?? 0;
        const scheduleText = group.schedules?.length
          ? group.schedules.map((s) => `${s.day.slice(0, 3)} ${s.startTime}`).join(", ")
          : "No schedule set";

        return (
          <Card key={group.id} className="hover:border-primary/50 transition-colors flex flex-col">
            <CardHeader className="pb-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <Badge
                  variant={group.type === "GROUP" ? "default" : "secondary"}
                  className="font-mono text-[10px] tracking-wide"
                >
                  {group.type}
                </Badge>
                {group.isOnline ? (
                  <Badge variant="outline" className="text-emerald-600 border-emerald-600/30 text-[10px] gap-1">
                    <Wifi className="h-3 w-3" /> Online
                  </Badge>
                ) : (
                  group.room && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <DoorOpen className="h-3.5 w-3.5" /> {group.room}
                    </span>
                  )
                )}
              </div>
              <h2 className="font-semibold text-base leading-tight hover:underline">
                <Link href={`/dashboard/groups/${group.id}`}>{group.name}</Link>
              </h2>
            </CardHeader>

            <CardContent className="space-y-2 text-xs text-muted-foreground flex-1">
              <div className="flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5" />
                <span>{[group.level, group.subject].filter(Boolean).join(" • ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span className="truncate">{scheduleText}</span>
              </div>
            </CardContent>

            <CardFooter className="pt-3 border-t flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{studentCount} {studentCount === 1 ? "Student" : "Students"}</span>
              </div>
              <Link
                href={`/dashboard/groups/${group.id}`}
                className="text-primary hover:underline flex items-center gap-0.5 font-medium"
              >
                View Details <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}