"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableFilterBarProps {
  search: string | null;
  onSearchChange: (value: string | null) => void;
  status: string | null;
  onStatusChange: (value: string | null) => void;
  level: string | null;
  onLevelChange: (value: string | null) => void;
  subject: string | null;
  onSubjectChange: (value: string | null) => void;
  onReset: () => void;
}

export function TableFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  level,
  onLevelChange,
  subject,
  onSubjectChange,
  onReset,
}: TableFilterBarProps) {
  const hasActiveFilters = search || status !== "ALL" || level !== "ALL" || subject !== "ALL";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-lg border">
      <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student or phone..."
            value={ search ?? "" }
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Level Filter */}
        {/* <Select value={level} onValueChange={onLevelChange}>
          <SelectTrigger className="w-full sm:w-36 h-9">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Levels</SelectItem>
            <SelectItem value="1AS">1AS</SelectItem>
            <SelectItem value="2AS">2AS</SelectItem>
            <SelectItem value="3AS">3AS</SelectItem>
            <SelectItem value="4AM">4AM</SelectItem>
          </SelectContent>
        </Select> */}

        {/* Subject Filter */}
        {/* <Select value={subject} onValueChange={onSubjectChange}>
          <SelectTrigger className="w-full sm:w-40 h-9">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Subjects</SelectItem>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="Physics">Physics</SelectItem>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
            <SelectItem value="Sciences">Sciences</SelectItem>
          </SelectContent>
        </Select> */}

        {/* Status Filter */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-36 h-9">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-9 px-2 text-xs">
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Reset Filters
        </Button>
      )}
    </div>
  );
}