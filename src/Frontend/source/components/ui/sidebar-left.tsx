"use client";
import * as React from "react";
import {
  Users,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Settings2,
} from "lucide-react";
import { NavMain } from "@/components/ui/nav-main";
import { FaTrophy } from "react-icons/fa";
import { IconChartDonutFilled } from "@tabler/icons-react";
import { NavSecondary } from "@/components/ui/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { FaComments } from "react-icons/fa6";
import { IconCarambolaFilled } from "@tabler/icons-react";
import { IconUserScan } from "@tabler/icons-react";
import { IconConeFilled } from "@tabler/icons-react";
import { FaUsers } from "react-icons/fa";
import { IconDeviceGamepad3Filled } from "@tabler/icons-react";
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
      icon: IconConeFilled,
      isActive: true,
    },
    {
      title: "Friends",
      url: "/friends",
      icon: FaUsers,
    },
    {
      title: "Leader Board",
      url: "/LeaderBoard",
      icon: FaTrophy,
    },
    {
      title: "Match History",
      url: "/MatchHistory",
      icon: IconChartDonutFilled,
      badge: "10",
    },
    {
      title: "Chat",
      url: "/messages",
      icon: FaComments,
    },
    {
      title: "Achievements",
      url: "/achievement",
      icon: IconCarambolaFilled,
    },
    {
      title: "Game",
      url: "/games",
      icon: IconDeviceGamepad3Filled,
    },
  ],
  navSecondary: [
    {
      title: "Profile",
      url: "/Profile",
      icon: IconUserScan,
    },
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
};
export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="gap-10 ">
        <h1 className="font-dayson text-[25px] text-black dark:text-white">
          Ping Pong
        </h1>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent className="">
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
