"use client";

import { useState } from "react";
import { format } from "date-fns";
import { UserPlus, Trash2, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GroupStudentMember, groupKeys } from "@/lib/queries/group";
import { useApiMutation } from "@/hooks/use-api";
import { AddStudentsModal } from "./add-students-modal";

interface GroupStudentsTabProps {
  groupId: string;
  students: GroupStudentMember[];
}

export function GroupStudentsTab({ groupId, students }: GroupStudentsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mutation for unenrolling a student with dynamic path parameter
  const unenrollMutation = useApiMutation<void, { path: string }>(
    "",
    "DELETE",
    groupKeys.detail(groupId)
  );

  const handleRemoveStudent = (studentId: string) => {
    if (confirm("Are you sure you want to remove this student from the group?")) {
      unenrollMutation.mutate({
        path: `/groups/${groupId}/students/${studentId}`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Group Members</h3>
          <p className="text-xs text-muted-foreground">Students enrolled in this group.</p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)} className="gap-2">
          <UserPlus className="h-4 w-4" /> Enroll Student
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {students.length === 0 ? (
          <Card className="col-span-full py-8 text-center text-sm text-muted-foreground">
            No students enrolled in this group yet.
          </Card>
        ) : (
          students.map((student) => (
            <Card key={student.id} className="relative group hover:border-primary/50 transition-colors">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">
                      {student.firstName} {student.lastName}
                    </h4>
                    <Badge variant={student.status === "ACTIVE" ? "outline" : "secondary"} className="text-[10px]">
                      {student.status}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveStudent(student.id)}
                    disabled={unenrollMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {student.phone}
                  </p>
                  {student.joinedAt && (
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> Joined {format(new Date(student.joinedAt), "PP")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AddStudentsModal
        groupId={groupId}
        enrolledStudentIds={students.map((s) => s.id)}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}