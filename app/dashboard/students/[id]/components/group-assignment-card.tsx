"use client";

import {
  BookOpen,
  DoorOpen,
  UserMinus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  StudentGroupDetail,
} from "@/lib/queries/student-detail";

import { groupKeys } from "@/lib/queries/group";
import { useApiMutation } from "@/hooks/use-api";
import { studentKeys } from "@/lib/queries/students";
import { useQueryClient } from "@tanstack/react-query";

interface GroupAssignmentCardProps {
  studentId: string;
  assignment: StudentGroupDetail;
}

export function GroupAssignmentCard({
  studentId,
  assignment,
}: GroupAssignmentCardProps) {
  const { group, joinedAt } = assignment;
  
  const queryClient = useQueryClient();


  const unenrollMutation = useApiMutation<void>(
    `/groups/${group.id}/students/${studentId}`,
    "DELETE",
    // groupKeys.detail(group.id)
    studentKeys.detail(studentId)
  );

  const handleUnenroll = () => {
    if (
      !confirm(
        `Are you sure you want to unenroll this student from "${group.name}"?`
      )
    ) {
      return;
    }

    // unenrollMutation.mutate(undefined);
    unenrollMutation.mutate(undefined, {
      onSuccess: async () => {
      await Promise.all([
          queryClient.invalidateQueries({
            queryKey: groupKeys.detail(group.id),
          }),
          queryClient.invalidateQueries({
            queryKey: studentKeys.all,
          }),
          // queryClient.invalidateQueries({
          //   queryKey: groupKeys.all,
          // }),
        ]);
      },
    });
  };

  return (
    <div className="flex items-center justify-between p-3.5 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm">
            {group.name}
          </p>

          {group.isOnline && (
            <Badge
              variant="secondary"
              className="text-[10px]"
            >
              Online
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {(group.level || group.subject) && (
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />

              {[group.level, group.subject]
                .filter(Boolean)
                .join(" • ")}
            </span>
          )}

          {group.room && (
            <span className="flex items-center gap-1">
              <DoorOpen className="h-3 w-3" />

              {group.room}
            </span>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground">
          Enrolled:{" "}
          {new Date(joinedAt).toLocaleDateString()}
        </p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
        disabled={unenrollMutation.isPending}
        onClick={handleUnenroll}
      >
        <UserMinus className="h-4 w-4" />

        <span className="sr-only">
          Unenroll student
        </span>
      </Button>
    </div>
  );
}
