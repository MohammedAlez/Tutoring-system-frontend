// lib/queries/students.ts
import { useApiQuery, useApiMutation } from "@/hooks/use-api";

// ============================================================
// TYPES
// ============================================================

export type StudentStatus = "ACTIVE" | "INACTIVE";

export interface GroupSummary {
  id: string;
  name: string;
}

export interface GroupStudentRelation {
  group: GroupSummary;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  parentName?: string | null;
  parentPhone?: string | null;
  level?: string | null;
  school?: string | null;
  subject?: string | null;
  enrollmentDate: string;
  status: StudentStatus;
  notes?: string | null;
  groupStudents?: GroupStudentRelation[];
  createdAt: string;
  updatedAt: string;
}

export interface GetStudentsParams {
  search?: string;
  status?: string;
  level?: string;
  subject?: string;
  page?: number;
  limit?: number;
}

export interface GetStudentsResponse {
  data: Student[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateStudentPayload {
  firstName: string;
  lastName: string;
  phone?: string;
  parentName?: string;
  parentPhone?: string;
  level?: string;
  school?: string;
  subject?: string;
  notes?: string;
}

// ============================================================
// QUERY KEYS
// ============================================================

export const studentKeys = {
  all: ["students"] as const,
  list: (params: GetStudentsParams) => [...studentKeys.all, "list", params] as const,
  detail: (id: string) => [...studentKeys.all, "detail", id] as const,
};

// ============================================================
// CLIENT HOOKS (via /api/proxy)
// ============================================================

export function useStudents(params: GetStudentsParams) {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.set("search", params.search);
  if (params.status && params.status !== "ALL") queryParams.set("status", params.status);
  if (params.level && params.level !== "ALL") queryParams.set("level", params.level);
  if (params.subject && params.subject !== "ALL") queryParams.set("subject", params.subject);
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());

  const path = `/students?${queryParams.toString()}`;

  return useApiQuery<GetStudentsResponse>(
    studentKeys.list(params),
    path,
    {staleTime: 0}
  );
}

export function useCreateStudent() {
  return useApiMutation<Student, CreateStudentPayload>(
    "/students",
    "POST",
    studentKeys.all
  );
}