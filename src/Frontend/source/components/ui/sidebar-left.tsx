"use client"
import * as React from "react"
import {
  Users,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Settings2,
  Sparkles,
} from "lucide-react"                       
import { NavMain } from "@/components/ui/nav-main"
import { NavSecondary } from "@/components/ui/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
// This is sample data.
const data = {
  teams: [
    {
      name: "Ping Pong",
      logo: Command,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "home",
      icon: Home,
      isActive: true,
    },
    {
      title: "Friends",
      url: "/friends",
      icon: Users,
    },
    {
      title: "Leader Board",
      url: "/LeaderBoard",
      icon: Sparkles,
    },
    {
      title: "Match History",
      url: "/MatchHistory",
      icon: Inbox,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
    {
      title: "logout",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
}
export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="gap-10 bg-[#28AFB08C]">
        <h1 className="font-dayson text-[25px]">Ping Pong</h1>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent className="bg-[#28AFB08C]">
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}