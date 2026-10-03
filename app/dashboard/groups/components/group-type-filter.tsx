"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GroupTypeFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export function GroupTypeFilter({ selectedType, onTypeChange }: GroupTypeFilterProps) {
  return (
    <Tabs value={selectedType} onValueChange={onTypeChange} className="w-full sm:w-auto">
      <TabsList className="grid w-full grid-cols-3 sm:w-[320px]">
        <TabsTrigger value="ALL">All</TabsTrigger>
        <TabsTrigger value="GROUP">Group</TabsTrigger>
        <TabsTrigger value="INDIVIDUAL">Individual</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}