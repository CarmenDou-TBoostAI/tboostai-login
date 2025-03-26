"use client"

import { LogIn, UserPlus } from 'lucide-react'
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useRouter } from 'next/navigation'

export function NavAuth() {
  const router = useRouter()

  const handlesignup = () => {
    router.push('/signup')
  }
  const handlesignin = () => {
    router.push('/login')
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={handlesignin}
          tooltip="Login"
        >
          <LogIn className="h-4 w-4" />
          <span className="ml-2">Login</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={handlesignup}
          tooltip="Sign Up"
        >
          <UserPlus className="h-4 w-4" />
          <span className="ml-2">Sign Up</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

