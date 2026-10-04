"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GroupTypeFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export function GroupTypeFilter({ selectedType, onTypeChange }: GroupTypeFilterProps) {
  return (
    <Tabs
      value={selectedType}
      onValueChange={onTypeChange}
      className="w-full"
    >
      <TabsList className="h-auto w-full max-w-3xl justify-start gap-1.5 rounded-2xl border bg-card p-6 px-1.5 shadow-sm">
        <TabsTrigger
          value="ALL"
          className="
            rounded-xl px-5 py-4 text-sm font-medium
            text-muted-foreground transition-all
            hover:text-foreground
            data-[state=active]:bg-primary
            data-[state=active]:text-primary-foreground
            data-[state=active]:shadow-md
            data-[state=active]:shadow-primary/30
          "
        >
          All
        </TabsTrigger>

        <TabsTrigger
          value="GROUP"
          className="
            rounded-xl px-5 py-4 text-sm font-medium
            text-muted-foreground transition-all
            hover:text-foreground
            data-[state=active]:bg-primary
            data-[state=active]:text-primary-foreground
            data-[state=active]:shadow-md
            data-[state=active]:shadow-primary/30
          "
        >
          Group
        </TabsTrigger>

        <TabsTrigger
          value="INDIVIDUAL"
          className="
            rounded-xl px-5 py-4 text-sm font-medium
            text-muted-foreground transition-all
            hover:text-foreground
            data-[state=active]:bg-primary
            data-[state=active]:text-primary-foreground
            data-[state=active]:shadow-md
            data-[state=active]:shadow-primary/30
          "
        >
          Individual
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}