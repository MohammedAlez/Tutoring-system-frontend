"use client";

import { useState } from "react";
import { Save, FileText, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUpdateStudentProfile } from "@/lib/queries/student-detail";

interface NotesCardProps {
  studentId: string;
  initialNotes: string | null;
}

export function NotesCard({ studentId, initialNotes }: NotesCardProps) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const updateNotesMutation = useUpdateStudentProfile(studentId);

  const handleSave = () => {
    updateNotesMutation.mutate(
      { notes },
      {
        onSuccess: () => {
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 2000);
        },
      }
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" /> Academic & Behavioral Notes
        </CardTitle>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={updateNotesMutation.isPending || notes === (initialNotes || "")}
          className="h-8 px-3"
        >
          {savedSuccess ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" /> Saved
            </>
          ) : (
            <>
              <Save className="mr-1.5 h-3.5 w-3.5" />
              {updateNotesMutation.isPending ? "Saving..." : "Save Notes"}
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add academic performance details, behavior observations, special instructions..."
          rows={4}
          className="resize-none"
        />
      </CardContent>
    </Card>
  );
}