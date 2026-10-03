"use client";

import { useApiQuery } from "@/hooks/use-api";
import { GroupAttendanceStats, groupKeys } from "@/lib/queries/group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface GroupAttendanceStatsTabProps {
  groupId: string;
}

export function GroupAttendanceStatsTab({ groupId }: GroupAttendanceStatsTabProps) {
  const { data: response, isLoading } = useApiQuery<{ data: GroupAttendanceStats }>(
    groupKeys.attendanceStats(groupId),
    `/groups/${groupId}/attendance-stats` // Endpoint from docs[cite: 15]
  );

  const statsData = response?.data;

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full rounded-xl" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-bold">Attendance Matrix</CardTitle>
        <p className="text-xs text-muted-foreground">
          Total Completed Sessions: {statsData?.totalCompletedSessions ?? 0}
        </p>
      </CardHeader>
      <CardContent>
        {!statsData || statsData.students.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">No attendance records found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Student Name</TableHead>
                <TableHead className="text-xs text-center">Present</TableHead>
                <TableHead className="text-xs text-center">Late</TableHead>
                <TableHead className="text-xs text-center">Absent</TableHead>
                <TableHead className="text-xs text-center">Excused</TableHead>
                <TableHead className="text-xs text-right">Attendance Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statsData.students.map((item) => (
                <TableRow key={item.studentId}>
                  <TableCell className="font-medium text-xs">
                    {item.firstName} {item.lastName}
                  </TableCell>
                  <TableCell className="text-center text-xs font-semibold text-emerald-600">
                    {item.stats.present}
                  </TableCell>
                  <TableCell className="text-center text-xs font-semibold text-amber-600">
                    {item.stats.late}
                  </TableCell>
                  <TableCell className="text-center text-xs font-semibold text-rose-600">
                    {item.stats.absent}
                  </TableCell>
                  <TableCell className="text-center text-xs font-semibold text-blue-600">
                    {item.stats.excused}
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={item.stats.attendancePercentage} className="w-16 h-2" />
                      <span className="font-mono font-bold w-10">
                        {item.stats.attendancePercentage}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}