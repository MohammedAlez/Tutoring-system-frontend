"use client"

import { useState } from "react"
import { useApiMutation } from "@/hooks/use-api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle2, KeyRound, AlertCircle } from "lucide-react"

interface ChangePasswordDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ChangePasswordDialog({ isOpen, onClose }: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const changePasswordMutation = useApiMutation<
    { message: string },
    { currentPassword: string; newPassword: string }
  >("/auth/change-password", "POST")

  const isFormValid =
    currentPassword !== "" &&
    newPassword !== "" &&
    newPassword === confirmPassword

  const handleClose = () => {
    if (changePasswordMutation.isPending) return
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setErrorMessage(null)
    setSuccess(false)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.")
      return
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      })

      setSuccess(true)
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to change password. Check your current password.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <KeyRound className="h-4 w-4 text-primary" />
            Change Password
          </DialogTitle>
          <DialogDescription className="text-xs">
            Enter your current password and set a new password for your account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="current" className="text-xs font-semibold">
              Current Password
            </Label>
            <Input
              id="current"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new" className="text-xs font-semibold">
              New Password
            </Label>
            <Input
              id="new"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm" className="text-xs font-semibold">
              Confirm New Password
            </Label>
            <Input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-destructive bg-destructive/10 p-2.5 rounded-md">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-md border border-emerald-200/60">
              <CheckCircle2 className="h-4 w-4" />
              Password updated successfully!
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={changePasswordMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={changePasswordMutation.isPending || !isFormValid}
            >
              {changePasswordMutation.isPending ? "Updating..." : "Save Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}