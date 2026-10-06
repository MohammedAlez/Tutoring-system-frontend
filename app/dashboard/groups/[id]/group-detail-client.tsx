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

      <Tabs defaultValue="students" className="w-full space-y-6">
        <TabsList className="h-auto w-full max-w-3xl justify-start gap-1.5 rounded-2xl border bg-card p-7 px-1.5 shadow-sm">
          <TabsTrigger
            value="students"
            className="
              group gap-2.5 rounded-xl px-6 py-5 text-sm font-medium
              text-muted-foreground transition-all
              hover:text-foreground
              data-[state=active]:bg-primary
              data-[state=active]:text-primary-foreground
              data-[state=active]:shadow-md
              data-[state=active]:shadow-primary/30
            "
          >
            <Users className="h-4.5 w-4.5" />

            <span>Students</span>

            <span
              className="
                rounded-xl bg-black/5 px-2 py-0.5 text-xs tabular-nums
                group-data-[state=active]:bg-white/20
              "
            >
              {group._count?.students ?? group.students.length}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="schedules"
            className="
              group gap-2.5 rounded-xl px-6 py-5 text-sm font-medium
              text-muted-foreground transition-all
              hover:text-foreground
              data-[state=active]:bg-primary
              data-[state=active]:text-primary-foreground
              data-[state=active]:shadow-md
              data-[state=active]:shadow-primary/30
            "
          >
            <Clock className="h-4.5 w-4.5" />

            <span>Schedules</span>

            <span
              className="
                rounded-xl bg-black/5 px-2 py-0.5 text-xs tabular-nums
                group-data-[state=active]:bg-white/20
              "
            >
              {group.schedules.length}
            </span>
          </TabsTrigger>

          {/* <TabsTrigger
            value="sessions"
            className="
              group gap-2.5 rounded-xl px-6 py-5 text-sm font-medium
              text-muted-foreground transition-all
              hover:text-foreground
              data-[state=active]:bg-primary
              data-[state=active]:text-primary-foreground
              data-[state=active]:shadow-md
              data-[state=active]:shadow-primary/30
            "
          >
            <Calendar className="h-4.5 w-4.5" />

            <span>Sessions</span>

            <span
              className="
                rounded-xl bg-black/5 px-2 py-0.5 text-xs tabular-nums
                group-data-[state=active]:bg-white/20
              "
            >
              {group._count?.sessions ?? 0}
            </span>
          </TabsTrigger> */}

          <TabsTrigger
            value="attendance"
            className="
              group gap-2.5 rounded-xl px-6 py-5 text-sm font-medium
              text-muted-foreground transition-all
              hover:text-foreground
              data-[state=active]:bg-primary
              data-[state=active]:text-primary-foreground
              data-[state=active]:shadow-md
              data-[state=active]:shadow-primary/30
            "
          >
            <BarChart3 className="h-4.5 w-4.5" />

            <span>Attendance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <GroupStudentsTab
            groupId={groupId}
            students={group.students}
          />
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <RecurringScheduleTab
            groupId={groupId}
            schedules={group.schedules}
          />
        </TabsContent>

        {/* <TabsContent value="sessions" className="space-y-4">
          <GroupSessionsTab groupId={groupId} />
        </TabsContent> */}

        <TabsContent value="attendance" className="space-y-4">
          <GroupAttendanceStatsTab groupId={groupId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}