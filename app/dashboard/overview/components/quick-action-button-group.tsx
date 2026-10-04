import Link from "next/link";
import { UserPlus, FolderPlus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActionButtonGroup() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        nativeButton={false}
        render={
          <Link href="/dashboard/students">
            <UserPlus className="mr-2 h-4 w-4" /> Add Student
          </Link>
        }
      />
      <Button
        size="sm"
        variant="outline"
        nativeButton={false}
        render={
          <Link href="/dashboard/groups">
            <FolderPlus className="mr-2 h-4 w-4" /> Create Group
          </Link>
        }
      />
      <Button
        size="sm"
        variant="outline"
        nativeButton={false}
        render={
          <Link href="/dashboard/payments">
            <CreditCard className="mr-2 h-4 w-4" /> Record Payment
          </Link>
        }
      />
    </div>
  );
}