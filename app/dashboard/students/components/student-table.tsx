"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, Eye, Edit, Trash2, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Student } from "@/lib/queries/students";

interface StudentTableProps {
  students: Student[];
  isLoading: boolean;
}

export function StudentTable({ students, isLoading }: StudentTableProps) {
  const router = useRouter();

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Contacts</TableHead>
            {/* <TableHead>Level / Subject</TableHead> */}
            <TableHead>Enrolled Groups</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><div className="h-4 w-32 animate-pulse rounded bg-muted" /></TableCell>
                <TableCell><div className="h-4 w-28 animate-pulse rounded bg-muted" /></TableCell>
                <TableCell><div className="h-4 w-20 animate-pulse rounded bg-muted" /></TableCell>
                <TableCell><div className="h-4 w-24 animate-pulse rounded bg-muted" /></TableCell>
                <TableCell><div className="h-4 w-16 animate-pulse rounded bg-muted" /></TableCell>
                <TableCell className="text-right"><div className="h-8 w-8 animate-pulse rounded bg-muted ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                No students found matching your parameters.
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => {
              const groups = student.groupStudents?.map((gs) => gs.group.name) || [];

              return (
                <TableRow
                  key={student.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/dashboard/students/${student.id}`)}
                >
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold text-foreground">
                        {student.firstName} {student.lastName}
                      </p>
                      {student.school && (
                        <p className="text-xs text-muted-foreground">{student.school}</p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs space-y-0.5">
                      {student.phone ? (
                        <p className="flex items-center gap-1 text-foreground">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {student.phone}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">No student phone</p>
                      )}
                      {student.parentName && (
                        <p className="text-muted-foreground">
                          Parent: {student.parentName} ({student.parentPhone || "N/A"})
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* <TableCell>
                    <div className="text-xs">
                      <span className="font-medium">{student.level || "N/A"}</span>
                      {student.subject && (
                        <span className="text-muted-foreground"> • {student.subject}</span>
                      )}
                    </div>
                  </TableCell> */}

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {groups.length > 0 ? (
                        groups.map((groupName, idx) => (
                          <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {groupName}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">Unassigned</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={student.status === "ACTIVE" ? "default" : "outline"}
                      className={
                        student.status === "ACTIVE"
                          ? "bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20 border-emerald-600/20"
                          : "text-muted-foreground"
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon" }),
                          "h-8 w-8 p-0"
                        )}
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/students/${student.id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> View Profile
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem onClick={() => router.push(`/dashboard/students/${student.id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Profile
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}