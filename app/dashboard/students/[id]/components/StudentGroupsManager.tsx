"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnrollStudentDialog } from "./EnrollStudentDialog";

interface GroupStudent {
  id: string;
  groupId: string;
  group: {
    id: string;
    name: string;
    subject?: string;
    level?: string;
  };
}

interface StudentGroupsManagerProps {
  studentId: string;
  groupStudents: GroupStudent[];
}

export function StudentGroupsManager({ studentId, groupStudents = [] }: StudentGroupsManagerProps) {
  const router = useRouter();
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleUnenroll = async (groupId: string) => {
    setRemovingId(groupId);
    try {
      const res = await fetch(`/api/groups/${groupId}/students/${studentId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to unenroll student");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  const enrolledGroupIds = groupStudents.map((gs) => gs.groupId);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {groupStudents.map((gs) => (
        <Badge
          key={gs.id}
          variant="secondary"
          className="text-xs px-2 py-0.5 flex items-center gap-1 pr-1"
        >
          <span>{gs.group.name}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleUnenroll(gs.groupId);
            }}
            disabled={removingId === gs.groupId}
            className="hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
          >
            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
          </button>
        </Badge>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-6 text-[10px] px-2 gap-1"
        onClick={() => setEnrollOpen(true)}
      >
        <Plus className="h-3 w-3" /> Enroll
      </Button>

      <EnrollStudentDialog
        studentId={studentId}
        enrolledGroupIds={enrolledGroupIds}
        open={enrollOpen}
        onOpenChange={setEnrollOpen}
      />
    </div>
  );
}