"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  ActivityIcon,
  BookOpenIcon,
  ClipboardCheckIcon,
  DollarSignIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  CalendarClock ,
  SchoolIcon,
  UsersIcon,
  SettingsIcon,
  UserIcon,
  PresentationIcon,
  CalendarClockIcon,
  FolderKanbanIcon,
  CreditCardIcon,
} from "lucide-react"
import { GalleryVerticalEndIcon } from "lucide-react"

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc.",
      logo: (
        <GalleryVerticalEndIcon size={30}
        />
      ),
      plan: "School",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/dashboard/overview",
      icon: <LayoutDashboardIcon size={24} />,
    },
    {
      title: "Students",
      url: "/dashboard/students",
      icon: <UsersIcon size={24} />,
    },
    {
      title: "Groups",
      url: "/dashboard/groups",
      icon: <FolderKanbanIcon size={24} />,
    },
    {
      title: "Schedule",
      url: "/dashboard/schedule",
      icon: <CalendarClockIcon size={24} />,
    },
    {
      title: "Sessions",
      url: "/dashboard/sessions",
      icon: <PresentationIcon size={24} />,
    },
    // {
    //   title: "Attendance",
    //   url: "/dashboard/attendance",
    //   icon: <ClipboardCheckIcon size={24} />,
    // },
    {
      title: "Payments",
      url: "/dashboard/payments",
      icon: <CreditCardIcon size={24} />,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: <SettingsIcon size={24} />,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
