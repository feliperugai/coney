"use client";

import { type User } from "next-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import AppDropdown from "./app-logo";
import NavigationMenu from "./navigation-menu";
import UserMenu from "./user-menu";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  menu: Group[];
  user: User;
};

export default function AppSidebar({ menu, user, ...props }: AppSidebarProps) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="flex min-h-screen flex-col"
    >
      <SidebarHeader>
        <AppDropdown />
      </SidebarHeader>
      <div className="flex-1 overflow-auto">
        <SidebarContent>
          {menu.map((item) => (
            <NavigationMenu key={item.groupLabel} item={item} />
          ))}
        </SidebarContent>
      </div>
      <SidebarFooter>
        <UserMenu user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
