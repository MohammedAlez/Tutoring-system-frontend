"use client";

import { useState } from "react";

import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { GroupStudentMember } from "@/lib/queries/group";

import { AddStudentsModal } from "./add-students-modal";
import { StudentCard } from "./student-card";

interface GroupStudentsTabProps {
  groupId: string;
  students: GroupStudentMember[];
}

export function GroupStudentsTab({
  groupId,
  students,
}: GroupStudentsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Group Members</h3>

          <p className="text-xs text-muted-foreground">
            Students enrolled in this group.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Enroll Student
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {students.length === 0 ? (
          <Card className="col-span-full py-8 text-center text-sm text-muted-foreground">
            No students enrolled in this group yet.
          </Card>
        ) : (
          students.map((student) => (
            <StudentCard
              key={student.id}
              groupId={groupId}
              student={student}
            />
          ))
        )}
      </div>

      <AddStudentsModal
        groupId={groupId}
        enrolledStudentIds={students.map((student) => student.id)}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}