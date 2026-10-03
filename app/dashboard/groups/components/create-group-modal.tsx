"use client";

import { useState } from "react";
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

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGroupModal({ open, onOpenChange }: CreateGroupModalProps) {
  const [formData, setFormData] = useState<CreateGroupInput>({
    name: "",
    type: "GROUP",
    subject: "",
    level: "",
    room: "",
    isOnline: false,
  });

  // Client-side mutation with automatic query cache invalidation[cite: 10]
  const createGroup = useApiMutation<void, CreateGroupInput>(
    "/groups",
    "POST",
    groupKeys.all
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createGroup.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({
          name: "",
          type: "GROUP",
          subject: "",
          level: "",
          room: "",
          isOnline: false,
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Create New Class or Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {createGroup.isError && (
            <p className="text-xs text-destructive">
              {createGroup.error?.message || "Failed to create group. Please try again."}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              placeholder="e.g., 3AS Math Advanced - Group A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(val) => {
                    if (val) {
                    setFormData((prev) => ({ ...prev, type: val }));
                    }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GROUP">GROUP</SelectItem>
                  <SelectItem value="INDIVIDUAL">INDIVIDUAL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                placeholder="e.g., 3AS, 4AM"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g., Mathematics, Physics"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label className="text-sm">Online Session</Label>
              <p className="text-xs text-muted-foreground">This group meets virtually</p>
            </div>
            <Switch
              checked={formData.isOnline}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isOnline: checked, room: checked ? "" : formData.room })
              }
            />
          </div>

          {!formData.isOnline && (
            <div className="space-y-1.5">
              <Label htmlFor="room">Room / Location</Label>
              <Input
                id="room"
                placeholder="e.g., Room 102"
                value={formData.room || ""}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              />
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createGroup.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createGroup.isPending}>
              {createGroup.isPending ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}