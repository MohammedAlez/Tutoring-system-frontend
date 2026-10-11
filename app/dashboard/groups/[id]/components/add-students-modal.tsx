"use client";

import { useState } from "react";
import { Search, CheckCircle2, Plus, Calendar, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  // Billing configuration form state
  const [billingMode, setBillingMode] = useState<"RECURRING" | "ONE_TIME">("RECURRING");
  const [billingFee, setBillingFee] = useState<string>("6000");
  const [initialInvoiceAmount, setInitialInvoiceAmount] = useState<string>("6000");
  const [billingIntervalMonths, setBillingIntervalMonths] = useState<string>("1");
  const [nextBillingDate, setNextBillingDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [periodStart, setPeriodStart] = useState<string>(new Date().toISOString().split("T")[0]);
  const [periodEnd, setPeriodEnd] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // Search available students endpoint
  const { data: response, isLoading } = useApiQuery<{ data: StudentSearchItem[] }>(
    groupKeys.availableStudents(searchTerm),
    `/students?search=${encodeURIComponent(searchTerm)}&limit=20`
  );

  // Enroll mutation[cite: 4]
  const enrollMutation = useApiMutation<
    { id: string },
    {
      studentId: string;
      billingMode: string;
      billingFee: number;
      initialInvoiceAmount?: number;
      billingIntervalMonths?: number;
      nextBillingDate?: string;
      periodStart?: string;
      periodEnd?: string;
      dueDate?: string;
    }
  >(
    `/groups/${groupId}/students`, // Endpoint from docs[cite: 4]
    "POST",
    groupKeys.detail(groupId)
  );

  const availableStudents = (response?.data || []).filter(
    (student) => !enrolledStudentIds.includes(student.id)
  );

  const handleEnroll = () => {
    if (!selectedStudentId) return;

    enrollMutation.mutate(
      {
        studentId: selectedStudentId,
        billingMode,
        billingFee: parseFloat(billingFee) || 0,
        initialInvoiceAmount: initialInvoiceAmount ? parseFloat(initialInvoiceAmount) : undefined,
        billingIntervalMonths: parseInt(billingIntervalMonths) || 1,
        nextBillingDate: billingMode === "RECURRING" && nextBillingDate ? new Date(nextBillingDate).toISOString() : undefined,
        periodStart: periodStart ? new Date(periodStart).toISOString() : undefined,
        periodEnd: periodEnd ? new Date(periodEnd).toISOString() : undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      },
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enroll Student into Group & Configure Billing</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Step 1: Select Student */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">1. Select Student</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name or phone..."
                className="pl-9 text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-[180px] overflow-y-auto space-y-1.5 border rounded-lg p-2">
              {isLoading ? (
                <div className="text-center py-4 text-xs text-muted-foreground">Searching students...</div>
              ) : availableStudents.length === 0 ? (
                <div className="text-center py-4 text-xs text-muted-foreground">
                  No available students found.
                </div>
              ) : (
                availableStudents.map((student) => {
                  const isSelected = selectedStudentId === student.id;
                  return (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-xs transition-colors ${
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

          {/* Step 2: Billing Configuration */}
          <div className="space-y-4 border-t pt-4">
            <Label className="text-xs font-semibold">2. Billing Configuration</Label>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Billing Mode</Label>
                <Select
                  value={billingMode}
                  onValueChange={(val) => {val && setBillingMode(val)}}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RECURRING">Recurring Billing</SelectItem>
                    <SelectItem value="ONE_TIME">One-Time Billing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">
                  {billingMode === "RECURRING" ? "Recurring Cycle Fee (DZD)" : "Total Fee (DZD)"}
                </Label>
                <Input
                  type="number"
                  className="text-xs"
                  value={billingFee}
                  onChange={(e) => setBillingFee(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">First Invoice Amount (DZD)</Label>
                <Input
                  type="number"
                  className="text-xs"
                  value={initialInvoiceAmount}
                  onChange={(e) => setInitialInvoiceAmount(e.target.value)}
                />
              </div>

              {billingMode === "RECURRING" && (
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">Billing Interval (Months)</Label>
                  <Select
                    value={billingIntervalMonths}
                    onValueChange={(val) => {val && setBillingIntervalMonths(val)}}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Every 1 Month</SelectItem>
                      <SelectItem value="2">Every 2 Months</SelectItem>
                      <SelectItem value="3">Every 3 Months (Term)</SelectItem>
                      <SelectItem value="6">Every 6 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Period Start</Label>
                <Input
                  type="date"
                  className="text-xs"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Period End</Label>
                <Input
                  type="date"
                  className="text-xs"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Due Date</Label>
                <Input
                  type="date"
                  className="text-xs"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {billingMode === "RECURRING" && (
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Next Billing Date</Label>
                <Input
                  type="date"
                  className="text-xs"
                  value={nextBillingDate}
                  onChange={(e) => setNextBillingDate(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Live Invoice Preview Box */}
          <div className="rounded-lg bg-muted/50 p-3 border space-y-2 text-xs">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-primary" />
              Initial Invoice Preview
            </p>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <div>Initial Amount: <span className="font-medium text-foreground">{initialInvoiceAmount || 0} DZD</span></div>
              <div>Recurring Fee: <span className="font-medium text-foreground">{billingFee || 0} DZD</span></div>
              <div>Period: <span className="font-medium text-foreground">{periodStart} to {periodEnd}</span></div>
              <div>Due Date: <span className="font-medium text-foreground">{dueDate}</span></div>
            </div>
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
            {enrollMutation.isPending ? "Enrolling..." : "Enroll Student & Create Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}