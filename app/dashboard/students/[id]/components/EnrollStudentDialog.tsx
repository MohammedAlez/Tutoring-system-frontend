"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiQuery, useApiMutation } from "@/hooks/use-api";
import { studentKeys } from "@/lib/queries/students";

interface GroupOption {
  id: string;
  name: string;
  subject: string;
  level: string;
  status: string;
}

interface EnrollStudentDialogProps {
  studentId: string;
  enrolledGroupIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnrollStudentDialog({
  studentId,
  enrolledGroupIds = [],
  open,
  onOpenChange,
}: EnrollStudentDialogProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string|null>(null);

  // 1. Client-side fetching using useApiQuery
  const { data: groupsResponse, isLoading: isFetchingGroups, isError } = useApiQuery<{ data: GroupOption[] }>(
    ["groups", "active"],
    "/groups?status=ACTIVE",
  );

  // Filter out groups the student is already enrolled in
  const availableGroups = (groupsResponse?.data || []).filter(
    (g) => !enrolledGroupIds.includes(g.id)
  );

  // 2. Client-side mutation using useApiMutation
  const enrollMutation = useApiMutation<void, { studentId: string }>(
    selectedGroupId ? `/groups/${selectedGroupId}/students` : "",
    "POST",
    studentKeys.detail(studentId) // Auto-invalidates and refetches student detail cache on success
  );

  const handleEnroll = () => {
    if (!selectedGroupId) return;

    enrollMutation.mutate(
      { studentId },
      {
        onSuccess: () => {
          setSelectedGroupId("");
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Enroll in Group</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {isError && (
            <p className="text-xs text-destructive">Failed to load available groups.</p>
          )}
          {enrollMutation.isError && (
            <p className="text-xs text-destructive">
              {enrollMutation.error?.message || "Failed to enroll student."}
            </p>
          )}

          <div className="space-y-1.5">
            <Label>Select Group</Label>
            <Select
              value={selectedGroupId}
              onValueChange={setSelectedGroupId}
              disabled={isFetchingGroups}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={isFetchingGroups ? "Loading groups..." : "Choose a group"}
                />
              </SelectTrigger>
              <SelectContent>
                {availableGroups.length === 0 ? (
                  <div className="p-2 text-xs text-muted-foreground text-center">
                    No available groups
                  </div>
                ) : (
                  availableGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name} ({group.level} • {group.subject})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={enrollMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEnroll}
            disabled={!selectedGroupId || enrollMutation.isPending}
          >
            {enrollMutation.isPending ? "Enrolling..." : "Enroll Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}