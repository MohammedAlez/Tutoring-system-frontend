"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useApiMutation } from "@/hooks/use-api";
import { studentKeys } from "@/lib/queries/students";

interface EditStudentDialogProps {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    status: string;
    notes?: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditStudentDialog({ student, open, onOpenChange }: EditStudentDialogProps) {
  const [formData, setFormData] = useState({
    firstName: student.firstName || "",
    lastName: student.lastName || "",
    phone: student.phone || "",
    status: student.status || "ACTIVE",
    notes: student.notes || "",
  });

  // Use the API mutation hook targeting the proxy tunnel and invalidating student query cache on success
  const updateStudent = useApiMutation<void, typeof formData>(
    `/students/${student.id}`,
    "PATCH",
    studentKeys.detail(student.id) // Automatically invalidates and refetches student details
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateStudent.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false);
      },
      onError: (error) => {
        console.error("Failed to update student profile:", error);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Student Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(val) => setFormData({ ...formData, ...(val && {status: val}) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="INACTIVE">INACTIVE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateStudent.isPending}>
              {updateStudent.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}