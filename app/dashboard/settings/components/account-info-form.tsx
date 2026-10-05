"use client"

import { useState } from "react"
import { useApiMutation } from "@/hooks/use-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Save, AlertCircle } from "lucide-react"

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  status: string
  createdAt: string
  updatedAt: string
}

interface AccountInfoFormProps {
  profile: UserProfile
}

export function AccountInfoForm({ profile }: AccountInfoFormProps) {
  const [firstName, setFirstName] = useState(profile.firstName || "")
  const [lastName, setLastName] = useState(profile.lastName || "")
  const [email, setEmail] = useState(profile.email || "")
  const [phone, setPhone] = useState(profile.phone || "")
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Use proxy endpoint targeting /user/profile
  const updateProfileMutation = useApiMutation<
    { success: boolean; data: UserProfile },
    { firstName?: string; lastName?: string; email?: string; phone?: string | null }
  >("/user/profile", "PATCH", ["user-profile"])

  const isDirty =
    firstName !== profile.firstName ||
    lastName !== profile.lastName ||
    email !== profile.email ||
    phone !== (profile.phone || "")

  const isFormValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== ""

  const isPending = updateProfileMutation.isPending
  const isDisabled = !isDirty || !isFormValid || isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isDisabled) return

    setSavedSuccess(false)

    try {
      await updateProfileMutation.mutateAsync({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() ? phone.trim() : null,
      })
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (err) {
      console.error("Failed to update profile:", err)
    }
  }

  return (
    <Card className="border shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Personal Information</CardTitle>
        <CardDescription>
          Update your contact details and account information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0555123456"
              />
            </div>
          </div>

          {updateProfileMutation.isError && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
              <AlertCircle className="h-4 w-4" />
              {updateProfileMutation.error?.message || "Failed to save profile changes."}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            {savedSuccess ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4" />
                Profile updated successfully
              </span>
            ) : <div />}

            <Button type="submit" disabled={isDisabled} className="gap-2">
              <Save className="h-4 w-4" />
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}