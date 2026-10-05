import { fetchWithAuth } from "@/lib/api"
import { requireUser } from "@/lib/user"
import { SettingsClientView } from "./settings-client-view"
import { UserProfile } from "./components/account-info-form"

export default async function SettingsPage() {
  await requireUser()

  const res = await fetchWithAuth("/user/profile")
  
  console.log("User profile response status:", res);
  if (!res.ok) {
    return <div className="text-red-500">Failed to load user profile. Please try again later.</div>
    throw new Error("Failed to load user profile")
  }

  const responseData = await res.json()
  const profile: UserProfile = responseData.data

  return <SettingsClientView profile={profile} />
}