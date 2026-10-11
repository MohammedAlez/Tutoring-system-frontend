"use client";

import Link from "next/link";
import { AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UpcomingInvoiceItem } from "@/lib/queries/dashboard";

interface UnpaidStudentsWidgetProps {
  invoices?: UpcomingInvoiceItem[];
  totalOutstanding?: string;
  isLoading: boolean;
}

export function UnpaidStudentsWidget({
  invoices = [],
  totalOutstanding = "0",
  isLoading,
}: UnpaidStudentsWidgetProps) {
  const numericOutstanding = Number(totalOutstanding);

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-amber-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" /> Unpaid Balances
          </CardTitle>
          <CardDescription>
            Total Pending:{" "}
            <span className="font-semibold text-foreground">
              {numericOutstanding.toLocaleString()} DZD
            </span>
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={
            <Link href="/dashboard/payments" className="flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          }
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded bg-muted" />
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground text-xs">
            All student payments are currently up to date!
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => {
              const balance = Number(inv.outstandingBalance);
              return (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/40 text-xs"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {inv.student.firstName} {inv.student.lastName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {inv.enrollment?.group?.name || "General"} • {inv.student.phone || "No phone"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-600 text-sm">
                      {balance.toLocaleString()} DZD
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      nativeButton={false}
                      className="h-auto p-0 text-[11px]"
                      render={
                        <Link href={`/dashboard/payments?search=${encodeURIComponent(inv.student.firstName)}`}>
                          Record Payment
                        </Link>
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}