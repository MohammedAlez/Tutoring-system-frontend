"use client"

import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useCurrentUser } from "@/my-components/user-provider"
import Link from "next/link"


export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode, 
    // roles: string[] // Add a roles property to specify which roles can access this item
  }[]
}) {
  const pathname = usePathname()
  const currentUser = useCurrentUser() 
  
  console.log(currentUser) // Log the current user object to the console

  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {

          // const isActive = pathname === item.url
          const isActive =
            pathname === item.url || pathname.startsWith(`${item.url}/`)

            
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={isActive}
                render={<Link href={item.url} />}
                tooltip={item.title}
                className="p-6"
              >
                {item.icon}
                <span className="text-base">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}