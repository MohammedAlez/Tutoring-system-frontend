"use client";

import { useState } from "react";

import { Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  StudentGroupDetail,
} from "@/lib/queries/student-detail";

import { EnrollStudentDialog } from "./EnrollStudentDialog";
import { GroupAssignmentCard } from "./group-assignment-card";

interface GroupAssignmentsTabProps {
  studentId: string;
  groups: StudentGroupDetail[];
}

export function GroupAssignmentsTab({
  studentId,
  groups = [],
}: GroupAssignmentsTabProps) {
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);

  const enrolledGroupIds = groups.map((group) => group.groupId);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-semibold">
            Assigned Groups
          </CardTitle>

          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setIsEnrollOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Enroll in Group
          </Button>
        </CardHeader>

        <CardContent>
          {groups.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground space-y-2">
              <Users className="h-8 w-8 mx-auto text-muted-foreground/50" />

              <p>
                This student is not enrolled in any groups yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {groups.map((assignment) => (
                <GroupAssignmentCard
                  key={assignment.id}
                  studentId={studentId}
                  assignment={assignment}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EnrollStudentDialog
        studentId={studentId}
        enrolledGroupIds={enrolledGroupIds}
        open={isEnrollOpen}
        onOpenChange={setIsEnrollOpen}
      />
    </>
  );
}
