// app/dashboard/sessions/sessions-client.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApiQuery } from '@/hooks/use-api'; //[cite: 10]
import {
  SessionItem,
  SessionStatus,
  SessionsQueryParams,
  buildSessionsApiPath,
  sessionsQueryKey,
} from '@/lib/queries/sessions';
import { SessionCard, SessionCardSkeleton } from './components/session-card';
import { SessionStatusBadge } from './components/session-status-badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Search, Sparkles, FilterX, MapPin, Globe, ArrowRight } from 'lucide-react';

interface SessionsClientProps {
  todayStr: string; // YYYY-MM-DD
}

export function SessionsClient({ todayStr }: SessionsClientProps) {
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [statusFilter, setStatusFilter] = useState<SessionStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const queryParams: SessionsQueryParams = {
    startDate: selectedDate,
    endDate: selectedDate,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  };

  // Fetch sessions via /api/proxy (triggers JIT auto-generation on backend)
  const { data: response, isLoading, isFetching } = useApiQuery<{
    success: boolean;
    data: SessionItem[];
  }>(
    sessionsQueryKey(queryParams),
    buildSessionsApiPath(queryParams) //[cite: 10]
  );

  const sessions = response?.data || [];

  // Filter list by client-side search query (Group Name or Subject)
  const filteredSessions = sessions.filter((s) =>
    s.group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.group.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isToday = selectedDate === todayStr;

  return (
    <div className="space-y-8">
      {/* Search & Filter Toolbar */}
      {/* <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[200px] flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search group or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as SessionStatus | 'ALL')}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {(selectedDate !== todayStr || statusFilter !== 'ALL' || searchQuery !== '') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedDate(todayStr);
                setStatusFilter('ALL');
                setSearchQuery('');
              }}
              className="text-muted-foreground hover:text-foreground gap-1"
            >
              <FilterX className="w-4 h-4" /> Reset Filters
            </Button>
          )}
        </div>

        {isFetching && !isLoading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Updating slots...
          </div>
        )}
      </div> */}

      {/* TODAY'S HERO CARDS (Only highlighted when date is set to Today) */}
      {isToday && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
              {/* <Sparkles className="w-5 h-5 text-amber-500" /> */}
              Today's Actionable Sessions
            </h2>
            <span className="text-xs text-muted-foreground">
              {isLoading ? 'Materializing schedule...' : `${sessions.length} sessions scheduled for today`}
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SessionCardSkeleton />
              <SessionCardSkeleton />
              <SessionCardSkeleton />
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center bg-card rounded-xl border border-dashed">
              <p className="text-muted-foreground">No sessions scheduled for today.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* SESSIONS TABLE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            {isToday ? 'Session Directory' : `Sessions for ${selectedDate}`}
          </h2>
        </div>

        <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Group Name</TableHead>
                <TableHead>Time Slot</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attendance Records</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No matching sessions found for this query.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSessions.map((session) => {
                  const startTime = new Date(session.scheduledStart).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const endTime = new Date(session.scheduledEnd).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <TableRow key={session.id} className="hover:bg-muted/30">
                    <TableCell className="font-semibold text-foreground">
                        <div>
                        {session.group.name}
                        <div className="text-xs font-normal text-muted-foreground">
                            {session.group.subject} ({session.group.level})
                        </div>
                        </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground whitespace-nowrap">
                        {startTime} - {endTime}
                    </TableCell>

                    <TableCell>
                        {session.isOnline ? (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            <Globe className="w-3 h-3" /> Online
                        </span>
                        ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" /> {session.room || 'Room N/A'}
                        </span>
                        )}
                    </TableCell>

                    <TableCell>
                        <SessionStatusBadge status={session.status} />
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                        {session._count.attendance} records
                    </TableCell>

                        <TableCell className="text-right">
                        <Link
                            href={`/dashboard/sessions/${session.id}`}
                            className={buttonVariants({
                            variant: 'ghost',
                            size: 'sm',
                            className: 'gap-1',
                            })}
                        >
                            Manage
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}