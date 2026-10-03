"use client";

import { useApiQuery } from "@/hooks/use-api";
import { GroupDetail, groupKeys } from "@/lib/queries/group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, Clock, BarChart3, BookOpen } from "lucide-react";
import { GroupHeader } from "./components/group-header";
import { GroupStudentsTab } from "./components/group-students-tab";
import { RecurringScheduleTab } from "./components/recurring-schedule-tab";
import { GroupSessionsTab } from "./components/group-sessions-tab";
import { GroupAttendanceStatsTab } from "./components/group-attendance-stats-tab";

interface GroupDetailClientProps {
  groupId: string;
  initialGroup: GroupDetail;
}

export function GroupDetailClient({ groupId, initialGroup }: GroupDetailClientProps) {
  const { data: response } = useApiQuery<{ data: GroupDetail }>(
    groupKeys.detail(groupId),
    `/groups/${groupId}`, // Endpoint from docs
    { initialData: { data: initialGroup } }
  );

  const group = response?.data || initialGroup;

  return (
    <div className="space-y-6">
      <GroupHeader group={group} />

      <Tabs defaultValue="students" className="w-full space-y-4">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl bg-muted/60 p-1">
          <TabsTrigger value="students" className="gap-2 text-xs font-medium">
            <Users className="h-4 w-4" /> Students ({group._count?.students ?? group.students.length})
          </TabsTrigger>
          <TabsTrigger value="schedules" className="gap-2 text-xs font-medium">
            <Clock className="h-4 w-4" /> Schedules ({group.schedules.length})
          </TabsTrigger>
          <TabsTrigger value="sessions" className="gap-2 text-xs font-medium">
            <Calendar className="h-4 w-4" /> Sessions ({group._count?.sessions ?? 0})
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2 text-xs font-medium">
            <BarChart3 className="h-4 w-4" /> Attendance Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <GroupStudentsTab groupId={groupId} students={group.students} />
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <RecurringScheduleTab groupId={groupId} schedules={group.schedules} />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <GroupSessionsTab groupId={groupId} />
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <GroupAttendanceStatsTab groupId={groupId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}