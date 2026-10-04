"use client";

import Link from "next/link";
import { AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PendingPayment } from "@/lib/queries/dashboard";

interface UnpaidStudentsWidgetProps {
  payments?: PendingPayment[];
  totalOutstanding?: number;
  isLoading: boolean;
}

export function UnpaidStudentsWidget({
  payments = [],
  totalOutstanding = 0,
  isLoading,
}: UnpaidStudentsWidgetProps) {
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
              {totalOutstanding.toLocaleString()} DA
            </span>
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={
            <Link href="/dashboard/payments?status=PENDING" className="flex items-center gap-1">
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
        ) : payments.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            All student payments are currently up to date!
          </div>
        ) : (
          <div className="space-y-3">
            {payments?.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/40"
              >
                <div>
                  <p className="font-medium text-sm">
                    {payment.student.firstName} {payment.student.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {payment.student.phone || "No phone registered"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-amber-600">
                    {payment.amount.toLocaleString()} DA
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    nativeButton={false}
                    className="h-auto p-0 text-xs"
                    render={
                      <Link href={`/dashboard/payments?search=${payment.student.firstName}`}>
                        Record Payment
                      </Link>
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}