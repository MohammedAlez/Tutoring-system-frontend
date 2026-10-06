"use client";

import { GroupDetail } from "@/lib/queries/group";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DoorOpen, Wifi, Users, BookOpen, Layers } from "lucide-react";

interface GroupHeaderProps {
  group: GroupDetail;
}

export function GroupHeader({ group }: GroupHeaderProps) {
  return (
    <Card className="border-l-4 border-l-primary shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight">{group.name}</h1>
              <Badge variant={group.type === "GROUP" ? "default" : "secondary"}>
                {group.type}
              </Badge>
              <Badge variant={group.status === "ACTIVE" ? "outline" : "destructive"}>
                {group.status}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-primary" /> {group.subject}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Layers className="h-4 w-4 text-primary" /> {group.level}
              </span>
              <span>•</span>
              {group.isOnline ? (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Wifi className="h-4 w-4" /> Online Class
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <DoorOpen className="h-4 w-4 text-primary" /> {group.room || "Room Unassigned"}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {group._count?.students ?? group.students.length}
              </p>
              <p className="text-xs text-muted-foreground font-medium">Enrolled Students</p>
            </div>
            <div className="text-center">
              {/* <p className="text-2xl font-bold text-primary">{group._count?.sessions ?? 0}</p> */}
              <p className="text-2xl font-bold text-primary">{group.schedules.length ?? 0}</p>
              <p className="text-xs text-muted-foreground font-medium">Total Sessions</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}