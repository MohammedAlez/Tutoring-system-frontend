"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Phone, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  GroupStudentMember,
  groupKeys,
} from "@/lib/queries/group";

import { useApiMutation } from "@/hooks/use-api";

interface StudentCardProps {
  groupId: string;
  student: GroupStudentMember;
}

export function StudentCard({
  groupId,
  student,
}: StudentCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const unenrollMutation = useApiMutation<void>(
    `/groups/${groupId}/students/${student.id}`,
    "DELETE",
    groupKeys.detail(groupId)
  );

  const handleConfirmRemove = () => {
    unenrollMutation.mutate(undefined, {
      onSuccess: () => {
        setIsDialogOpen(false);
      },
    });
  };

  return (
    <>
      <Card className="relative group hover:border-primary/50 transition-colors">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-sm">
                {student.firstName} {student.lastName}
              </h4>

              <Badge
                variant={
                  student.status === "ACTIVE"
                    ? "outline"
                    : "secondary"
                }
                className="text-[10px]"
              >
                {student.status}
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsDialogOpen(true)}
              disabled={unenrollMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              {student.phone}
            </p>

            {student.joinedAt && (
              <p className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Joined {format(new Date(student.joinedAt), "PP")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shadcn Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Remove Student from Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <span className="font-semibold text-foreground">{student.firstName} {student.lastName}</span> from this group?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
              disabled={unenrollMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmRemove}
              disabled={unenrollMutation.isPending}
            >
              {unenrollMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Confirm & Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}