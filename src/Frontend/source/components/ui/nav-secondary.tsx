import React from "react"
import { useRouter } from "next/navigation"
import { type LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    badge?: React.ReactNode
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const router = useRouter(); 
  const handleClick = () => {
    const fetchLogout = async () => {
      try {
        const response = await fetch('http://localhost:8080/accounts/auth/logout/', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLogout();
    router.push('/auth/login');
  };
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item: any) => (
            <SidebarMenuItem key={item.title} onClick={item.title === 'logout' ? handleClick : undefined}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon className="dark:text-white text-black"/>
                  <span className="font-dayson dark:text-white text-black">{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}