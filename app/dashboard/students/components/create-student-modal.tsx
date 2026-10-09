
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { useCreateStudent } from "@/lib/queries/students";

// Validation schema
const createStudentSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters."),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters."),

  phone: z.string(),
  parentName: z.string(),
  parentPhone: z.string(),
  level: z.string(),
  school: z.string(),
  subject: z.string(),
  notes: z.string(),
});

type CreateStudentFormValues = z.infer<typeof createStudentSchema>;

const defaultValues: CreateStudentFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  parentName: "",
  parentPhone: "",
  level: "3AS",
  school: "",
  subject: "Mathematics",
  notes: "",
};

interface CreateStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStudentModal({
  open,
  onOpenChange,
}: CreateStudentModalProps) {
  const createStudentMutation = useCreateStudent();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = (data: CreateStudentFormValues) => {
    setServerError(null);

    createStudentMutation.mutate(data, {
      onSuccess: () => {
        reset(defaultValues);
        setServerError(null);
        onOpenChange(false);
      },
      onError: (error) => {
        console.error("Failed to create student:", error);

        setServerError(
          error instanceof Error
            ? error.message
            : "Failed to create student. Please try again."
        );
      },
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setServerError(null);
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Create a student profile to track their enrollment,
            payments, and attendance.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-2"
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-destructive">*</span>
              </Label>

              <Input
                id="firstName"
                placeholder="Enter first name"
                autoComplete="given-name"
                aria-invalid={!!errors.firstName}
                aria-describedby={
                  errors.firstName ? "firstName-error" : undefined
                }
                {...register("firstName")}
              />

              {errors.firstName && (
                <p
                  id="firstName-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-destructive">*</span>
              </Label>

              <Input
                id="lastName"
                placeholder="Enter last name"
                autoComplete="family-name"
                aria-invalid={!!errors.lastName}
                aria-describedby={
                  errors.lastName ? "lastName-error" : undefined
                }
                {...register("lastName")}
              />

              {errors.lastName && (
                <p
                  id="lastName-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Student Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Student Phone</Label>

              <Input
                id="phone"
                type="tel"
                placeholder="0550123456"
                autoComplete="tel"
                {...register("phone")}
              />
            </div>

            {/* School */}
            <div className="space-y-2">
              <Label htmlFor="school">School / Establishment</Label>

              <Input
                id="school"
                placeholder="Lycée Abdelkader"
                {...register("school")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Parent Name */}
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent Name</Label>

              <Input
                id="parentName"
                placeholder="Enter parent name"
                {...register("parentName")}
              />
            </div>

            {/* Parent Phone */}
            <div className="space-y-2">
              <Label htmlFor="parentPhone">Parent Phone</Label>

              <Input
                id="parentPhone"
                type="tel"
                placeholder="0660123456"
                {...register("parentPhone")}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Observations</Label>

            <Textarea
              id="notes"
              rows={3}
              placeholder="Additional information..."
              {...register("notes")}
            />
          </div>

          {/* Server Error */}
          {serverError && (
            <div
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              {serverError}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createStudentMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                createStudentMutation.isPending || isSubmitting
              }
            >
              {createStudentMutation.isPending || isSubmitting
                ? "Creating..."
                : "Save Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}