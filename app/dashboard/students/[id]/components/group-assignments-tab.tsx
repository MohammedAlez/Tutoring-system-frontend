"use client";

import { useState } from "react";
import { Plus, UserMinus, Users, BookOpen, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudentGroupDetail, useUnenrollStudent } from "@/lib/queries/student-detail";
import { EnrollStudentDialog } from "./EnrollStudentDialog";

interface GroupAssignmentsTabProps {
  studentId: string;
  groups: StudentGroupDetail[];
}

export function GroupAssignmentsTab({ studentId, groups = [] }: GroupAssignmentsTabProps) {
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [removingGroupId, setRemovingGroupId] = useState<string | null>(null);

  const handleUnenroll = async (groupId: string) => {
    setRemovingGroupId(groupId);
    try {
      const res = await fetch(`/api/groups/${groupId}/students/${studentId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to unenroll student");
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingGroupId(null);
    }
  };

  const enrolledGroupIds = groups.map((g) => g.groupId);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-semibold">Assigned Groups</CardTitle>
          <Button size="sm" className="gap-1.5" onClick={() => setIsEnrollOpen(true)}>
            <Plus className="h-4 w-4" /> Enroll in Group
          </Button>
        </CardHeader>
        <CardContent>
          {groups.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground space-y-2">
              <Users className="h-8 w-8 mx-auto text-muted-foreground/50" />
              <p>This student is not enrolled in any groups yet.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {groups.map(({ id, group, joinedAt }) => (
                <div
                  key={id}
                  className="flex items-center justify-between p-3.5 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{group.name}</p>
                      {group.isOnline && <Badge variant="secondary" className="text-[10px]">Online</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {(group.level || group.subject) && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> {[group.level, group.subject].filter(Boolean).join(" • ")}
                        </span>
                      )}
                      {group.room && (
                        <span className="flex items-center gap-1">
                          <DoorOpen className="h-3 w-3" /> {group.room}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Enrolled: {new Date(joinedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                    disabled={removingGroupId === group.id}
                    onClick={() => handleUnenroll(group.id)}
                  >
                    <UserMinus className="h-4 w-4" />
                    <span className="sr-only">Unenroll student</span>
                  </Button>
                </div>
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