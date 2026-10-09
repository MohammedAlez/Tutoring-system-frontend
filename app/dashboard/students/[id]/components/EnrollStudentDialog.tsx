
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
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const {
    data: groupsResponse,
    isLoading: isFetchingGroups,
    isError,
  } = useApiQuery<{ data: GroupOption[] }>(
    ["groups", "active"],
    "/groups?status=ACTIVE"
  );

  // Exclude groups the student is already enrolled in.
  const availableGroups = (groupsResponse?.data || []).filter(
    (group) => !enrolledGroupIds.includes(group.id)
  );

  const selectedGroup = availableGroups.find(
    (group) => group.id === selectedGroupId
  );

  const enrollMutation = useApiMutation<
    void,
    { studentId: string }
  >(
    selectedGroupId
      ? `/groups/${selectedGroupId}/students`
      : "",
    "POST",
    studentKeys.detail(studentId)
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

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedGroupId("");
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Enroll in Group</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {isError && (
            <p className="text-sm text-destructive" role="alert">
              Failed to load available groups.
            </p>
          )}

          {enrollMutation.isError && (
            <p className="text-sm text-destructive" role="alert">
              {enrollMutation.error?.message ||
                "Failed to enroll student."}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="group">Select Group</Label>

            <Select
              value={selectedGroupId}
              onValueChange={(val) => val && setSelectedGroupId(val)}
              disabled={isFetchingGroups || availableGroups.length === 0}
            >
              <SelectTrigger id="group">
                <SelectValue
                  placeholder={
                    isFetchingGroups
                      ? "Loading groups..."
                      : "Choose a group"
                  }
                >
                  {selectedGroup && (
                    <span>{selectedGroup.name}</span>
                  )}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {availableGroups.length === 0 ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    {isFetchingGroups
                      ? "Loading groups..."
                      : "No available groups"}
                  </div>
                ) : (
                  availableGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">
                          {group.name}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {group.level} · {group.subject}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedGroup && (
            <p className="text-sm text-muted-foreground">
              Selected group:{" "}
              <span className="font-medium text-foreground">
                {selectedGroup.name}
              </span>
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={enrollMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            onClick={handleEnroll}
            disabled={
              !selectedGroupId || enrollMutation.isPending
            }
          >
            {enrollMutation.isPending
              ? "Enrolling..."
              : "Enroll Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}