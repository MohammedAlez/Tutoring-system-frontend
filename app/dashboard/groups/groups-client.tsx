"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiQuery } from "@/hooks/use-api";
import { GroupRecord, groupKeys } from "@/lib/queries/groups";
import { GroupCardGrid } from "./components/group-card-grid";
import { GroupTypeFilter } from "./components/group-type-filter";
import { CreateGroupModal } from "./components/create-group-modal";

interface GroupsClientProps {
  initialData: GroupRecord[];
}

export function GroupsClient({ initialData }: GroupsClientProps) {
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Client-side query via proxy endpoint[cite: 10]
  const typeParam = selectedType !== "ALL" ? `&type=${selectedType}` : "";
  const searchParam = search.trim() ? `&search=${encodeURIComponent(search.trim())}` : "";
  const queryPath = `/groups?status=ACTIVE${typeParam}${searchParam}`;

  const { data: response, isLoading } = useApiQuery<{ data: GroupRecord[] }>(
    groupKeys.list(selectedType, search),
    queryPath,
    { 
      initialData: selectedType === "ALL" && !search ? { data: initialData } : undefined,
      staleTime: 0
    }
  );

  const groups = response?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Group Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage class groups and individual standard sessions.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" /> Create Class Group
        </Button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <GroupTypeFilter selectedType={selectedType} onTypeChange={setSelectedType} />

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by group or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Grid view */}
      <GroupCardGrid groups={groups} isLoading={isLoading} />

      {/* Create Dialog */}
      <CreateGroupModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}