"use client";

import { useState } from "react";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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

import { useApiQuery, useApiMutation } from "@/hooks/use-api";
import { studentKeys } from "@/lib/queries/students";

interface GroupOption {
  id: string;
  name: string;
  subject: string;
  level: string;
  status: string;
}

interface EnrollStudentDialogProps {
  studentId: string;
  enrolledGroupIds?: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnrollStudentDialog({
  studentId,
  enrolledGroupIds = [],
  open,
  onOpenChange,
}: EnrollStudentDialogProps) {
  const [selectedGroupId, setSelectedGroupId] = useState("");

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

  const {
    data: groupsResponse,
    isLoading: isFetchingGroups,
    isError,
  } = useApiQuery<{ data: GroupOption[] }>(
    ["groups", "active"],
    "/groups?status=ACTIVE"
  );

  // Exclude groups the student is already enrolled in.
  const availableGroups = (groupsResponse?.data || []).filter(
    (group) => !enrolledGroupIds.includes(group.id)
  );

  const selectedGroup = availableGroups.find(
    (group) => group.id === selectedGroupId
  );

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
    selectedGroupId ? `/groups/${selectedGroupId}/students` : "",
    "POST",
    studentKeys.detail(studentId)
  );

  const handleEnroll = () => {
    if (!selectedGroupId) return;

    enrollMutation.mutate(
      {
        studentId,
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
          setSelectedGroupId("");
          onOpenChange(false);
        },
      }
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedGroupId("");
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enroll Student in Group & Configure Billing</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {isError && (
            <p className="text-sm text-destructive" role="alert">
              Failed to load available groups.
            </p>
          )}

          {enrollMutation.isError && (
            <p className="text-sm text-destructive" role="alert">
              {enrollMutation.error?.message || "Failed to enroll student."}
            </p>
          )}

          {/* Step 1: Select Group */}
          <div className="space-y-1.5">
            <Label htmlFor="group" className="font-semibold">1. Select Group</Label>

            <Select
              value={selectedGroupId}
              onValueChange={(val) => val && setSelectedGroupId(val)}
              disabled={isFetchingGroups || availableGroups.length === 0}
            >
              <SelectTrigger id="group" className="text-xs">
                <SelectValue
                  placeholder={
                    isFetchingGroups ? "Loading groups..." : "Choose a group"
                  }
                >
                  {selectedGroup && <span>{selectedGroup.name}</span>}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {availableGroups.length === 0 ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    {isFetchingGroups ? "Loading groups..." : "No available groups"}
                  </div>
                ) : (
                  availableGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{group.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {group.level} · {group.subject}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Step 2: Billing Configuration */}
          <div className="space-y-3 border-t pt-3">
            <Label className="font-semibold">2. Billing Configuration</Label>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Billing Mode</Label>
                <Select
                  value={billingMode}
                  onValueChange={(val) => (val && setBillingMode(val))}
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

              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">
                  {billingMode === "RECURRING" ? "Recurring Fee (DZD)" : "Total Fee (DZD)"}
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
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">First Invoice Amount (DZD)</Label>
                <Input
                  type="number"
                  className="text-xs"
                  value={initialInvoiceAmount}
                  onChange={(e) => setInitialInvoiceAmount(e.target.value)}
                />
              </div>

              {billingMode === "RECURRING" && (
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Billing Interval (Months)</Label>
                  <Select
                    value={billingIntervalMonths}
                    onValueChange={(val) => (val && setBillingIntervalMonths(val))}
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

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Period Start</Label>
                <Input
                  type="date"
                  className="text-xs"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Period End</Label>
                <Input
                  type="date"
                  className="text-xs"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                />
              </div>
              <div className="space-y-1">
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
              <div className="space-y-1">
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
          <div className="rounded-lg bg-muted/50 p-3 border space-y-2">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-primary" />
              Initial Invoice Preview
            </p>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground text-[11px]">
              <div>Initial Amount: <span className="font-medium text-foreground">{initialInvoiceAmount || 0} DZD</span></div>
              <div>Recurring Fee: <span className="font-medium text-foreground">{billingFee || 0} DZD</span></div>
              <div>Period: <span className="font-medium text-foreground">{periodStart} to {periodEnd}</span></div>
              <div>Due Date: <span className="font-medium text-foreground">{dueDate}</span></div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(false)}
            disabled={enrollMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={handleEnroll}
            disabled={!selectedGroupId || enrollMutation.isPending}
          >
            {enrollMutation.isPending
              ? "Enrolling..."
              : "Enroll Student & Create Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}