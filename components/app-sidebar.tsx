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
      icon: <LayoutDashboardIcon size={30} />,
      roles: ["ADMIN", "TEACHER", "STUDENT"],
    },
    {
      title: "Teachers",
      url: "/dashboard/teachers",
      icon: <GraduationCapIcon size={30} />,
      roles: ["ADMIN"],
    },
    {
      title: "My Students",
      url: "/dashboard/students",
      icon: <UsersIcon size={30} />,
      roles: ["TEACHER"],
    },
    {
      title: "Students",
      url: "/dashboard/students",
      icon: <UsersIcon size={30} />,
      roles: ["ADMIN"],
    },
    {
      title: "My Class",
      url: "/dashboard/classes",
      icon: <SchoolIcon size={30} />,
      roles: ["STUDENT"],
    },
    {
      title: "My Classes",
      url: "/dashboard/classes",
      icon: <SchoolIcon size={30} />,
      roles: ["TEACHER"],
    },
    {
      title: "Classes",
      url: "/dashboard/classes",
      icon: <SchoolIcon size={30} />,
      roles: ["ADMIN"],
    },
    {
      title: "My Subjects",
      url: "/dashboard/subjects",
      icon: <BookOpenIcon size={30} />,
      roles: ["STUDENT"],
    },
    {
      title: "Subjects",
      url: "/dashboard/subjects",
      icon: <BookOpenIcon size={30} />,
      roles: ["ADMIN"],
    },
    {
      title: "Assignments",
      url: "/dashboard/assignments",
      icon: <ListChecksIcon size={30} />,
      roles: ["ADMIN"],
    },
    {
      title: "Schedules",
      url: "/dashboard/schedule",
      icon: <CalendarClock size={30} />,
      roles: ["ADMIN", 'TEACHER', "STUDENT"],
    },
    {
      title: "My Attendance",
      url: "/dashboard/attendance",
      icon: <ClipboardCheckIcon size={30} />,
      roles: ["STUDENT"],
    },
    {
      title: "Attendance",
      url: "/dashboard/attendance",
      icon: <ClipboardCheckIcon size={30} />,
      roles: ["ADMIN", "TEACHER"],
    },
    {
      title: "My Grades",
      url: "/dashboard/grades",
      icon: <ActivityIcon size={30} />,
      roles: ["STUDENT"],
    },
    {
      title: "Grades",
      url: "/dashboard/grades",
      icon: <ActivityIcon size={30} />,
      roles: ["ADMIN", "TEACHER"],
    },
    {
      title: "Payments",
      url: "/dashboard/payments",
      icon: <DollarSignIcon size={30} />,
      roles: ["ADMIN"],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: <SettingsIcon size={30} />,
      roles: ["ADMIN"],
    },
    {
      title: "My Account",
      url: "/dashboard/account",
      icon: <UserIcon size={30} />,
      roles: ["TEACHER", "STUDENT"],
    },
    // {
    //   title: "My Account",
    //   url: "/dashboard/my-profile",
    //   icon: <UserIcon size={30} />,
    //   roles: ["STUDENT"],
    // },
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
