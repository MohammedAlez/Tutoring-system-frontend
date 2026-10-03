"use client";

import { useState } from "react";
import { Edit, Phone, School, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EditStudentDialog } from "./EditStudentDialog";

interface StudentHeaderCardProps {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    parentName?: string | null;
    parentPhone?: string | null;
    level?: string | null;
    school?: string | null;
    subject?: string | null;
    status: string;
    notes?: string | null;
    enrollmentDate?: string;
  };
}

export function StudentHeaderCard({ student }: StudentHeaderCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">
                  {student.firstName} {student.lastName}
                </h1>
                <Badge
                  variant={student.status === "ACTIVE" ? "default" : "outline"}
                  className={
                    student.status === "ACTIVE"
                      ? "bg-emerald-600/10 text-emerald-600 border-emerald-600/20"
                      : "text-muted-foreground"
                  }
                >
                  {student.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-muted-foreground">
                {student.phone && (
                  <span className="flex items-center gap-1 text-foreground font-medium">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    {student.phone}
                  </span>
                )}
                {student.school && (
                  <span className="flex items-center gap-1">
                    <School className="h-3.5 w-3.5" />
                    {student.school}
                  </span>
                )}
                {student.level && (
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {student.level} {student.subject ? `• ${student.subject}` : ""}
                  </span>
                )}
                {student.enrollmentDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Enrolled {new Date(student.enrollmentDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {student.parentName && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Parent:</span> {student.parentName} ({student.parentPhone || "N/A"})
                </p>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="self-start md:self-auto gap-2"
              onClick={() => setIsEditOpen(true)}
            >
              <Edit className="h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditStudentDialog
        student={student}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
}