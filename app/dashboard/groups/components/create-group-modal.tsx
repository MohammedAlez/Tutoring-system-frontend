
"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
import { groupKeys, CreateGroupInput } from "@/lib/queries/groups";

// Validation schema
const createGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Group name is required.")
    .min(2, "Group name must be at least 2 characters."),

  type: z.enum(["GROUP", "INDIVIDUAL"]),

  subject: z.string(),
  level: z.string(),
  room: z.string(),
  isOnline: z.boolean(),
});

type CreateGroupFormValues = z.infer<typeof createGroupSchema>;

const defaultValues: CreateGroupFormValues = {
  name: "",
  type: "GROUP",
  subject: "",
  level: "",
  room: "",
  isOnline: false,
};

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGroupModal({
  open,
  onOpenChange,
}: CreateGroupModalProps) {
  const createGroup = useApiMutation<void, CreateGroupInput>(
    "/groups",
    "POST",
    groupKeys.all
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues,
    mode: "onBlur",
  });

  const isOnline = watch("isOnline");

  const onSubmit = (data: CreateGroupFormValues) => {
    // Do not send a room for online sessions.
    const payload: CreateGroupInput = {
      ...data,
      room: data.isOnline ? "" : data.room,
    };

    createGroup.mutate(payload, {
      onSuccess: () => {
        reset(defaultValues);
        onOpenChange(false);
      },
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(defaultValues);
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Create New Class or Group</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-2"
          noValidate
        >
          {/* API error */}
          {createGroup.isError && (
            <div
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              {createGroup.error?.message ||
                "Failed to create group. Please try again."}
            </div>
          )}

          {/* Group Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Group Name <span className="text-destructive">*</span>
            </Label>

            <Input
              id="name"
              placeholder="e.g., 3AS Math Advanced - Group A"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
            />

            {errors.name && (
              <p
                id="name-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Type and Level */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="type">
                Type <span className="text-destructive">*</span>
              </Label>

              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="type"
                      aria-invalid={!!errors.type}
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="GROUP">Group</SelectItem>
                      <SelectItem value="INDIVIDUAL">
                        Individual
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.type && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="level">Level</Label>

              <Input
                id="level"
                placeholder="e.g., 3AS, 4AM"
                {...register("level")}
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject</Label>

            <Input
              id="subject"
              placeholder="e.g., Mathematics, Physics"
              {...register("subject")}
            />
          </div>

          {/* Online Session */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="isOnline" className="text-sm">
                Online Session
              </Label>

              <p className="text-xs text-muted-foreground">
                This group meets virtually
              </p>
            </div>

            <Controller
              name="isOnline"
              control={control}
              render={({ field }) => (
                <Switch
                  id="isOnline"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);

                    if (checked) {
                      setValue("room", "", {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
              )}
            />
          </div>

          {/* Room / Location */}
          {!isOnline && (
            <div className="space-y-1.5">
              <Label htmlFor="room">Room / Location</Label>

              <Input
                id="room"
                placeholder="e.g., Room 102"
                {...register("room")}
              />
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createGroup.isPending || isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={createGroup.isPending || isSubmitting}
            >
              {createGroup.isPending || isSubmitting
                ? "Creating..."
                : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}