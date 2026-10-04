// app/dashboard/sessions/[id]/session-detail-client.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApiQuery, useApiMutation } from '@/hooks/use-api';
import {
  SessionDetailData,
  SaveAttendancePayloadItem,
  sessionDetailQueryKey,
} from '@/lib/queries/session-detail';
import { AttendanceTable } from './components/attendance-table';
import { SessionStatusBadge } from '../components/session-status-badge';
import { CancelSessionModal } from './components/cancel-session-modal';
import { RescheduleSessionModal } from './components/reschedule-session-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  CalendarClock,
  CheckCheck,
  Globe,
  MapPin,
  Save,
  XCircle,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

export function SessionDetailClient({ sessionId }: { sessionId: string }) {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);

  // Local state map for optimistic/editable attendance data
  const [attendanceMap, setAttendanceMap] = useState<Map<string, SaveAttendancePayloadItem>>(
    new Map()
  );

  // Fetch Session + Pre-populated Attendance Records
  const { data: response, isLoading, isError } = useApiQuery<{
    success: boolean;
    data: SessionDetailData;
  }>(sessionDetailQueryKey(sessionId), `/sessions/${sessionId}`);

  const session = response?.data;

  // Initialize local attendance map when session data loads
  useEffect(() => {
    if (session?.students) {
      const initialMap = new Map<string, SaveAttendancePayloadItem>();
      session.students.forEach((s) => {
        initialMap.set(s.studentId, {
          studentId: s.studentId,
          status: s.status,
          note: s.note,
        });
      });
      setAttendanceMap(initialMap);
    }
  }, [session]);

  // Bulk Save Attendance Mutation
  const saveAttendanceMutation = useApiMutation<
    void,
    { attendance: SaveAttendancePayloadItem[] }
  >(
    `/sessions/${sessionId}/attendance`,
    'POST',
    sessionDetailQueryKey(sessionId)
  );

  const handleMarkAllPresent = () => {
    if (!session?.students) return;
    setAttendanceMap((prev) => {
      const next = new Map(prev);
      session.students.forEach((s) => {
        const current = next.get(s.studentId) || { studentId: s.studentId, status: null, note: null };
        next.set(s.studentId, { ...current, status: 'PRESENT' });
      });
      return next;
    });
  };

  const handleSaveAttendance = () => {
    const attendancePayload = Array.from(attendanceMap.values());
    saveAttendanceMutation.mutate({ attendance: attendancePayload });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !session) {
    return (
        <div className="p-8 text-center bg-card rounded-xl border space-y-4">
            <AlertTriangle className="w-10 h-10 text-destructive mx-auto" />
            <h2 className="text-lg font-semibold">Session Not Found</h2>
            <p className="text-sm text-muted-foreground">
            Could not retrieve details for this session record.
            </p>
            <Button
            nativeButton={false}
            variant="outline"
            render={<Link href="/dashboard/sessions">Back to Sessions</Link>}
            />
        </div>
    );
  }

  const startDate = new Date(session.scheduledStart);
  const formattedDate = startDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = new Date(session.scheduledEnd).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isCancelled = session.status === 'CANCELLED';

  return (
    <div className="space-y-6">
      {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
            <Button
                nativeButton={false}
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground"
                render={
                <Link href="/dashboard/sessions">
                    <ArrowLeft className="w-4 h-4" /> Back to Sessions
                </Link>
                }
            />
            <SessionStatusBadge status={session.status} />
        </div>

      {/* Main Session Banner */}
      <Card className=" shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {session.subject} • {session.level} ({session.groupType})
              </span>
              <CardTitle className="text-2xl font-bold mt-1">{session.groupName}</CardTitle>
            </div>

            {/* Action Toolbar */}
            {!isCancelled && (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllPresent}
                  className="gap-1.5"
                >
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                  Mark All Present
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRescheduleModalOpen(true)}
                  className="gap-1.5"
                >
                  <CalendarClock className="w-4 h-4 text-blue-600" />
                  Reschedule
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCancelModalOpen(true)}
                  className="gap-1.5 text-destructive hover:bg-destructive/10"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-2 text-sm text-muted-foreground border-t pt-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">
                {formattedDate} ({startTime} - {endTime})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {session.isOnline ? (
                <>
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="text-foreground">Online Room</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span className="text-foreground">{session.room || 'Room not assigned'}</span>
                </>
              )}
            </div>
          </div>

          {session.cancellationReason && (
            <div className="mt-3 p-3 bg-rose-500/10 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-600 dark:text-rose-400 text-xs">
              <strong>Cancellation Reason:</strong> {session.cancellationReason}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Attendance Section */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-bold">Student Attendance</CardTitle>
          {!isCancelled && (
            <Button
              onClick={handleSaveAttendance}
              disabled={saveAttendanceMutation.isPending}
              className="gap-2"
            >
              {saveAttendanceMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Attendance
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <AttendanceTable
            attendanceMap={attendanceMap}
            setAttendanceMap={setAttendanceMap}
            students={session.students}
            disabled={isCancelled}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <CancelSessionModal
        sessionId={sessionId}
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
      />

      <RescheduleSessionModal
        sessionId={sessionId}
        initialStart={session.scheduledStart}
        initialEnd={session.scheduledEnd}
        initialRoom={session.room}
        open={rescheduleModalOpen}
        onOpenChange={setRescheduleModalOpen}
      />
    </div>
  );
}