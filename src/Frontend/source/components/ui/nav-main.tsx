import { type LucideIcon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SideBarContext } from "@/context/SideBarContext";
import { useContext } from "react";
export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  const { setIsActivated } = useContext(SideBarContext);

  const handleItemClick = (url: string) => {
    if (url === "/home") {
      setIsActivated(1);
    } else if (url === "/settings") {
      setIsActivated(8);
    } else if (url === "games") {
      setIsActivated(2);
    } else if (url === "LeaderBoard") {
      setIsActivated(4);
    } else if (url === "MatchHistory") {
      setIsActivated(5);
    } else if (url === "friends") {
      setIsActivated(6);
    } else if (url === "messages") {
      setIsActivated(7);
    } else if (url === "achievement") {
      setIsActivated(3);
    }
  };
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={item.isActive}
            onClick={() => handleItemClick(item.title)} //chart
          >
            <a href={item.url}>
              <item.icon className="text-black dark:text-white" />
              <span className="font-dayson text-black dark:text-white">
                {item.title}
              </span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
