"use client";

import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudentAttendanceRecord, AttendanceStatus } from "@/lib/queries/student-detail";

interface AttendanceHistoryTabProps {
  records: StudentAttendanceRecord[];
}

export function AttendanceHistoryTab({ records }: AttendanceHistoryTabProps) {
  const total = records.length;
  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const lateCount = records.filter((r) => r.status === "LATE").length;
  const attendanceRate = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">
              Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{attendanceRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">
              Present
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-emerald-600">{presentCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">
              Late
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-amber-600">{lateCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">
              Absent
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-rose-600">
              {records.filter((r) => r.status === "ABSENT").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Log Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Group Session</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell className="font-medium">
                      {new Date(rec.session.scheduledStart).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{rec.session.group.name}</TableCell>
                    <TableCell>
                      <StatusBadge status={rec.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {rec.note || "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
  switch (status) {
    case "PRESENT":
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
          <CheckCircle2 className="mr-1 h-3 w-3" /> Present
        </Badge>
      );
    case "ABSENT":
      return (
        <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20">
          <XCircle className="mr-1 h-3 w-3" /> Absent
        </Badge>
      );
    case "LATE":
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
          <Clock className="mr-1 h-3 w-3" /> Late
        </Badge>
      );
    case "EXCUSED":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
          <AlertCircle className="mr-1 h-3 w-3" /> Excused
        </Badge>
      );
  }
}