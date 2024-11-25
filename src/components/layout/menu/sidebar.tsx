"use client";

import { AudioWaveform, GalleryVerticalEnd } from "lucide-react";

import { type User } from "next-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import AppDropdown from "./app-dropdown";
import NavigationMenu from "./navigation-menu";
import UserMenu from "./user-menu";

const data = {
  apps: [
    {
      name: "coney",
      logo: GalleryVerticalEnd,
      country: "Felipe",
      url: "#",
    },
    {
      name: "Bioatec",
      logo: AudioWaveform,
      country: "Nathalia",
      url: "#",
    },
  ],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  menu: Group[];
  user: User;
};

export default function AppSidebar({ menu, user, ...props }: AppSidebarProps) {
  return (
    <>
      <Sidebar
        collapsible="icon"
        {...props}
        className="bg-biotronik flex min-h-screen flex-col"
      >
        <SidebarHeader>
          <AppDropdown apps={data.apps} />
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
    </>
  );
}
