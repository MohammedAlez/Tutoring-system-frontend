"use client"

import { useState } from "react"
import { AccountInfoForm, UserProfile } from "./components/account-info-form"
import { ChangePasswordDialog } from "./components/change-password-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { KeyRound, ShieldCheck } from "lucide-react"

export function SettingsClientView({ profile }: { profile: UserProfile }) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal details and account security settings.
        </p>
      </div>

      <AccountInfoForm profile={profile} />

      <Card className="border shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Security & Password
          </CardTitle>
          <CardDescription>
            Manage your credentials and password security settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Account Password</p>
            <p className="text-xs text-muted-foreground">
              Update your password regularly to ensure your account stays secure.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsPasswordModalOpen(true)}
            className="gap-2"
          >
            <KeyRound className="h-4 w-4" /> Change Password
          </Button>
        </CardContent>
      </Card>

      <ChangePasswordDialog
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  )
}