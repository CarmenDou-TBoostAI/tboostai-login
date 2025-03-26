"use client"

import { type LucideIcon } from 'lucide-react'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Define a proper interface for navigation items
interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  requireAuth?: boolean
}

export function NavMain({
  items,
  onItemClick,
}: {
  items: NavItem[]
  onItemClick?: (item: NavItem) => void
}) {
  const handleClick = (item: NavItem, e: React.MouseEvent) => {
    if (onItemClick) {
      e.preventDefault()
      onItemClick(item)
    }
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <a 
                href={item.url} 
                onClick={(e) => handleClick(item, e)}
              >
                <item.icon />
                <span className="ml-2">{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

