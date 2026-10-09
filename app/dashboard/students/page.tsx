"use client";

import { useState } from "react";
import { UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableFilterBar } from "./components/table-filter-bar";
import { StudentTable } from "./components/student-table";
import { CreateStudentModal } from "./components/create-student-modal";
import { useStudents } from "@/lib/queries/students";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [level, setLevel] = useState("ALL");
  const [subject, setSubject] = useState("ALL");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useStudents({
    search,
    status,
    level,
    subject,
    page,
    limit: 10,
  },);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setLevel("ALL");
    setSubject("ALL");
    setPage(1);
  };

  const pagination = data?.pagination;

  return (
    <div className="space-y-6 p-2">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage student registrations, academic levels, and group enrollments.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Student
        </Button>
      </div>

      {/* Control Filter Bar */}
      <TableFilterBar
        search={search}
        onSearchChange={(val) => {
          (val && setSearch(val));
          setPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          (val && setStatus(val));
          setPage(1);
        }}
        level={level}
        onLevelChange={(val) => {
          (val && setLevel(val));
          setPage(1);
        }}
        subject={subject}
        onSubjectChange={(val) => {
          (val && setSubject(val));
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Main Table */}
      <StudentTable students={data?.data || []} isLoading={isLoading} />

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-xs text-muted-foreground">
            Showing page <span className="font-semibold">{pagination.page}</span> of{" "}
            <span className="font-semibold">{pagination.totalPages}</span> ({pagination.total}{" "}
            total students)
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Creation Modal */}
      <CreateStudentModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}