// lib/queries/sessions.ts

export type SessionStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface SessionGroup {
  id: string;
  name: string;
  type: string;
  subject: string;
  level: string;
}

export interface SessionItem {
  id: string;
  groupId: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  status: SessionStatus;
  room: string | null;
  isOnline: boolean;
  cancellationReason: string | null;
  group: SessionGroup;
  _count: {
    attendance: number;
  };
}

export interface SessionsQueryParams {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  groupId?: string;
  status?: SessionStatus;
}

export const sessionsQueryKey = (params: SessionsQueryParams) => [
  'sessions',
  params.startDate,
  params.endDate,
  params.groupId || 'all',
  params.status || 'all',
];

export const buildSessionsApiPath = (params: SessionsQueryParams) => {
  const query = new URLSearchParams();
  query.append('startDate', params.startDate);
  query.append('endDate', params.endDate);
  if (params.groupId) query.append('groupId', params.groupId);
  if (params.status) query.append('status', params.status);
  return `/sessions?${query.toString()}`;
};