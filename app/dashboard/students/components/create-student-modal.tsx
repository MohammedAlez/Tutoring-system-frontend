"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateStudent } from "@/lib/queries/students";

interface CreateStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStudentModal({ open, onOpenChange }: CreateStudentModalProps) {
  const createStudentMutation = useCreateStudent();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    parentName: "",
    parentPhone: "",
    level: "3AS",
    school: "",
    subject: "Mathematics",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStudentMutation.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          parentName: "",
          parentPhone: "",
          level: "3AS",
          school: "",
          subject: "Mathematics",
          notes: "",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Create a student profile to track their enrollment, payments, and attendance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Student Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="0550123456"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school">School / Establishment</Label>
              <Input
                id="school"
                name="school"
                placeholder="Lycée Abdelkader"
                value={formData.school}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent Name</Label>
              <Input
                id="parentName"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentPhone">Parent Phone</Label>
              <Input
                id="parentPhone"
                name="parentPhone"
                placeholder="0660123456"
                value={formData.parentPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Academic Level</Label>
              <Select
                value={formData.level}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, ...(val && {level: val}) }))}
              >
                <SelectTrigger id="level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1AS">1AS</SelectItem>
                  <SelectItem value="2AS">2AS</SelectItem>
                  <SelectItem value="3AS">3AS</SelectItem>
                  <SelectItem value="4AM">4AM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Primary Subject</Label>
              <Select
                value={formData.subject}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, ...(val && {subject: val}) }))}
              >
                <SelectTrigger id="subject">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Sciences">Sciences</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Observations</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={2}
              placeholder="Additional information..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createStudentMutation.isPending}>
              {createStudentMutation.isPending ? "Creating..." : "Save Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}