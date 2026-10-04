'use client';

import Link from 'next/link';
import { SessionItem } from '@/lib/queries/sessions';
import { SessionStatusBadge } from './session-status-badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { MapPin, Globe, Clock, Users, ArrowRight } from 'lucide-react';

export function SessionCard({ session }: { session: SessionItem }) {
  const startTime = new Date(session.scheduledStart).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endTime = new Date(session.scheduledEnd).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="flex flex-col justify-between  shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {session.group.subject} • {session.group.level}
            </span>
            <CardTitle className="text-lg font-bold text-foreground mt-0.5">
              {session.group.name}
            </CardTitle>
          </div>
          <SessionStatusBadge status={session.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5 pb-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">
            {startTime} - {endTime}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {session.isOnline ? (
            <>
              <Globe className="w-4 h-4 text-blue-500" />
              <span>Online Session</span>
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>{session.room || 'Room not assigned'}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-500" />
          <span>{session._count.attendance} attendance records</span>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
  <Link
    href={`/dashboard/sessions/${session.id}`}
    className={buttonVariants({
      variant: session.status === 'COMPLETED' ? 'outline' : 'default',
      className: 'w-full gap-2',
    })}
  >
    {session.status === 'SCHEDULED' ? 'Start & Mark Attendance' : 'View / Edit Attendance'}
    <ArrowRight className="w-4 h-4" />
  </Link>
</CardFooter>
    </Card>
  );
}

export function SessionCardSkeleton() {
  return (
    <Card className="flex flex-col justify-between shadow-sm animate-pulse">
      <CardHeader className="pb-3">
        <div className="h-4 w-24 bg-muted rounded mb-2" />
        <div className="h-6 w-3/4 bg-muted rounded" />
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        <div className="h-4 w-1/2 bg-muted rounded" />
        <div className="h-4 w-2/3 bg-muted rounded" />
        <div className="h-4 w-1/3 bg-muted rounded" />
      </CardContent>
      <CardFooter className="pt-0">
        <div className="h-10 w-full bg-muted rounded" />
      </CardFooter>
    </Card>
  );
}