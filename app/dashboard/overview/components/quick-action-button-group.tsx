import Link from "next/link";
import { UserPlus, FolderPlus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActionButtonGroup() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        render={
          <Link href="/dashboard/students/new">
            <UserPlus className="mr-2 h-4 w-4" /> Add Student
          </Link>
        }
      />
      <Button
        size="sm"
        variant="outline"
        render={
          <Link href="/dashboard/groups/new">
            <FolderPlus className="mr-2 h-4 w-4" /> Create Group
          </Link>
        }
      />
      <Button
        size="sm"
        variant="outline"
        render={
          <Link href="/dashboard/payments/new">
            <CreditCard className="mr-2 h-4 w-4" /> Record Payment
          </Link>
        }
      />
    </div>
  );
}