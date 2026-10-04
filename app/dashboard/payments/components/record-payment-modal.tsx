// app/dashboard/payments/_components/record-payment-modal.tsx
'use client';

import { useState } from 'react';
import { useApiQuery, useApiMutation } from '@/hooks/use-api';
import { CreatePaymentPayload, PaymentMethod, PaymentStatus, paymentsQueryKey } from '@/lib/queries/payments';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlusCircle } from 'lucide-react';

interface StudentOption {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  groupStudents?: Array<{
    group: {
      id: string;
      name: string;
    };
  }>;
}

interface StudentsApiResponse {
  data: StudentOption[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface RecordPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeMonth: string;
}

export function RecordPaymentModal({ open, onOpenChange, activeMonth }: RecordPaymentModalProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [amount, setAmount] = useState('3000');
  const [status, setStatus] = useState<PaymentStatus>('PAID');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [dueDate, setDueDate] = useState(`${activeMonth}-05`);
  const [periodStart, setPeriodStart] = useState(`${activeMonth}-01`);
  const [periodEnd, setPeriodEnd] = useState(`${activeMonth}-30`);
  const [note, setNote] = useState('');

  // Fetch active students list for dropdown
  const { data: studentsResponse, isLoading: isLoadingStudents } = useApiQuery<StudentsApiResponse>(
    ['students', 'active-list'],
    '/students?status=ACTIVE&limit=100',
    { enabled: open }
  );

  const students = studentsResponse?.data || [];

  const createMutation = useApiMutation<void, CreatePaymentPayload>(
    '/payments',
    'POST',
    paymentsQueryKey({ month: activeMonth })
  );

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    const student = students.find((s) => s.id === studentId);
    
    // Auto-assign primary group if student is enrolled in one
    if (student?.groupStudents && student.groupStudents.length > 0) {
      setSelectedGroupId(student.groupStudents[0].group.id);
    } else {
      setSelectedGroupId('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !amount) return;

    createMutation.mutate(
      {
        studentId: selectedStudentId,
        groupId: selectedGroupId || undefined,
        amount: Number(amount),
        status,
        dueDate,
        periodStart,
        periodEnd,
        paymentMethod: status === 'PAID' ? paymentMethod : undefined,
        note: note.trim() || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedStudentId('');
          setSelectedGroupId('');
          setNote('');
        },
      }
    );
  };

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-primary" />
            Record Payment Invoice
          </DialogTitle>
          <DialogDescription>
            Select a student to log a tuition payment or issue a pending invoice.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Student Selector Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="studentSelect">Select Student</Label>
            <Select value={selectedStudentId} onValueChange={handleStudentSelect}>
              <SelectTrigger id="studentSelect" className="w-full">
                <SelectValue placeholder={isLoadingStudents ? "Loading students..." : "Choose a student"}>
                  {selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                    {student.phone && <span className="text-muted-foreground text-xs ml-2">({student.phone})</span>}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Enrolled Group Selector Dropdown */}
          {selectedStudent && (
            <div className="space-y-2">
              <Label htmlFor="groupSelect">Enrolled Group</Label>
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger id="groupSelect" className="w-full">
                  <SelectValue placeholder="Select group">
                    {selectedStudent.groupStudents?.find((gs) => gs.group.id === selectedGroupId)?.group.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {selectedStudent.groupStudents?.map((gs) => (
                    <SelectItem key={gs.group.id} value={gs.group.id}>
                      {gs.group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Amount and Payment Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (DA)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select value={status} onValueChange={(val) => setStatus(val as PaymentStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {status === 'PAID' && (
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CCP">CCP</SelectItem>
                  <SelectItem value="BARIDIMOB">BaridiMob</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Billing Period */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="periodStart">Period Start</Label>
              <Input
                id="periodStart"
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="periodEnd">Period End</Label>
              <Input
                id="periodEnd"
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Notes / Receipt Ref</Label>
            <Textarea
              id="note"
              placeholder="Optional payment notes..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || !selectedStudentId}>
              {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}