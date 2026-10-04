// app/dashboard/sessions/_components/attendance-table.tsx
'use client';

import { AttendanceStatus, SaveAttendancePayloadItem } from '@/lib/queries/session-detail';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Phone } from 'lucide-react';
import { useState } from 'react';

interface AttendanceTableProps {
  attendanceMap: Map<string, SaveAttendancePayloadItem>;
  setAttendanceMap: React.Dispatch<React.SetStateAction<Map<string, SaveAttendancePayloadItem>>>;
  students: Array<{
    studentId: string;
    firstName: string;
    lastName: string;
    phone: string | null;
  }>;
  disabled?: boolean;
}

// const STATUS_OPTIONS: Array<{ value: NonNullable<AttendanceStatus>; label: string; activeClass: string }> = [
//   { value: 'PRESENT', label: 'P', activeClass: 'bg-emerald-600 text-white font-bold hover:bg-emerald-700' },
//   { value: 'ABSENT', label: 'A', activeClass: 'bg-rose-600 text-white font-bold hover:bg-rose-700' },
//   { value: 'LATE', label: 'L', activeClass: 'bg-amber-500 text-white font-bold hover:bg-amber-600' },
//   { value: 'EXCUSED', label: 'E', activeClass: 'bg-blue-600 text-white font-bold hover:bg-blue-700' },
// ];
const STATUS_OPTIONS: Array<{ value: NonNullable<AttendanceStatus>; label: string; activeClass: string }> = [
  { value: 'PRESENT', label: 'Present', activeClass: 'bg-emerald-600 text-white font-bold hover:bg-emerald-700' },
  { value: 'ABSENT', label: 'Absent', activeClass: 'bg-rose-600 text-white font-bold hover:bg-rose-700' },
];

export function AttendanceTable({
  attendanceMap,
  setAttendanceMap,
  students,
  disabled = false,
}: AttendanceTableProps) {
  const [search, setSearch] = useState('');

  const filteredStudents = students.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    if (disabled) return;
    setAttendanceMap((prev) => {
      const next = new Map(prev);
      const current = next.get(studentId) || { studentId, status: null, note: null };
      next.set(studentId, { ...current, status });
      return next;
    });
  };

  const handleNoteChange = (studentId: string, note: string) => {
    if (disabled) return;
    setAttendanceMap((prev) => {
      const next = new Map(prev);
      const current = next.get(studentId) || { studentId, status: null, note: null };
      next.set(studentId, { ...current, note: note || null });
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          Total Students: <span className="font-semibold text-foreground">{students.length}</span>
        </div>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[30%]">Student Name</TableHead>
              <TableHead className="w-[35%]">Status</TableHead>
              <TableHead className="w-[35%]">Note / Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((std) => {
                const record = attendanceMap.get(std.studentId) || {
                  studentId: std.studentId,
                  status: null,
                  note: null,
                };

                return (
                  <TableRow key={std.studentId} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <div>
                        {std.firstName} {std.lastName}
                        {std.phone && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" /> {std.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {STATUS_OPTIONS.map((opt) => {
                          const isSelected = record.status === opt.value;
                          return (
                            <Button
                              key={opt.value}
                              type="button"
                              size="sm"
                              variant={isSelected ? 'default' : 'outline'}
                              disabled={disabled}
                              onClick={() => handleStatusChange(std.studentId, opt.value)}
                              className={`h-8 px-4 font-medium transition-colors ${
                                isSelected ? opt.activeClass : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {opt.label}
                            </Button>
                          );
                        })}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Input
                        placeholder="Add note (optional)..."
                        value={record.note || ''}
                        disabled={disabled}
                        onChange={(e) => handleNoteChange(std.studentId, e.target.value)}
                        className="h-8 text-xs"
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}