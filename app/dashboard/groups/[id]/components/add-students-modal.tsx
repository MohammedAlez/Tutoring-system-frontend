"use client";

import { useState } from "react";
import { Search, CheckCircle2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApiQuery, useApiMutation } from "@/hooks/use-api";
import { groupKeys } from "@/lib/queries/group";

interface AddStudentsModalProps {
  groupId: string;
  enrolledStudentIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface StudentSearchItem {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  level: string;
}

export function AddStudentsModal({ groupId, enrolledStudentIds, open, onOpenChange }: AddStudentsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Search available students endpoint
  const { data: response, isLoading } = useApiQuery<{ data: StudentSearchItem[] }>(
    groupKeys.availableStudents(searchTerm),
    `/students?search=${encodeURIComponent(searchTerm)}&limit=20`,
    // { enabled: open }
  );

  // Enroll mutation[cite: 10, 14]
  const enrollMutation = useApiMutation<{ id: string }, { studentId: string }>(
    `/groups/${groupId}/students`, // Endpoint from docs[cite: 14]
    "POST",
    groupKeys.detail(groupId)
  );

  const availableStudents = (response?.data || []).filter(
    (student) => !enrolledStudentIds.includes(student.id)
  );

  const handleEnroll = () => {
    if (!selectedStudentId) return;

    enrollMutation.mutate(
      { studentId: selectedStudentId },
      {
        onSuccess: () => {
          setSelectedStudentId(null);
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Enroll Student into Group</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name or phone..."
              className="pl-9 text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="max-h-[280px] overflow-y-auto space-y-1.5 border rounded-lg p-2">
            {isLoading ? (
              <div className="text-center py-6 text-xs text-muted-foreground">Searching students...</div>
            ) : availableStudents.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">
                No available students found.
              </div>
            ) : (
              availableStudents.map((student) => {
                const isSelected = selectedStudentId === student.id;
                return (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`flex items-center justify-between p-2.5 rounded-md cursor-pointer text-xs transition-colors ${
                      isSelected ? "bg-primary/10 border-primary border" : "hover:bg-muted"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{student.firstName} {student.lastName}</p>
                      <p className="text-[11px] text-muted-foreground">{student.phone} • {student.level}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleEnroll}
            disabled={!selectedStudentId || enrollMutation.isPending}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            {enrollMutation.isPending ? "Enrolling..." : "Enroll Selected Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}