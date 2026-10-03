"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { StudentHeaderCard } from "./components/student-header-card";
import { NotesCard } from "./components/notes-card";
import { GroupAssignmentsTab } from "./components/group-assignments-tab";
import { AttendanceHistoryTab } from "./components/attendance-history-tab";
import { PaymentHistoryTab } from "./components/payment-history-tab";
import { useStudentDetail } from "@/lib/queries/student-detail";

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function StudentDetailPage({ params }: StudentDetailPageProps) {
  const resolvedParams = use(params);
  const { data: student, isLoading, isError } = useStudentDetail(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="h-44 bg-muted rounded-lg" />
        <div className="h-32 bg-muted rounded-lg" />
      </div>
    );
  }

  if (isError || !student) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-destructive">Student Profile Not Found</h2>
        <p className="text-muted-foreground text-sm">
          The requested student record does not exist or has been removed.
        </p>
        <Link
          href="/dashboard/students"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Back to Students List
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-full mx-auto">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          href="/dashboard/students"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "px-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Students Management
        </Link>
      </div>

      {/* Primary Header Card */}
      <StudentHeaderCard student={student} />

      {/* Academic / Behavioral Notes */}
      <NotesCard studentId={student.id} initialNotes={student.notes} />

      {/* Main Relational Tabs */}
      <Tabs defaultValue="groups" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="groups">Assigned Groups</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="groups">
            <GroupAssignmentsTab
              studentId={student.id}
              groups={student.groupStudents || []}
            />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceHistoryTab records={student.attendance || []} />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentHistoryTab
              studentId={student.id}
              payments={student.payments || []}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}