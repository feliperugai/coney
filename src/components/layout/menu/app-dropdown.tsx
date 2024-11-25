import { ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SidebarMenuButton } from "~/components/ui/sidebar";

interface TeamDropdownProps {
  apps: {
    name: string;
    logo: React.ComponentType<any>;
    country: string;
    url: string;
  }[];
}

export default function TeamDropdown({ apps }: TeamDropdownProps) {
  const [activeTeam, setActiveTeam] = useState(apps[0]!);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg">
          <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <activeTeam.logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {activeTeam.name}
            </span>
            <span className="truncate text-xs">{activeTeam.country}</span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg">
        <DropdownMenuLabel>Apps</DropdownMenuLabel>
        {apps.map((app) => (
          <DropdownMenuItem key={app.name} onClick={() => setActiveTeam(app)}>
            <div className="mr-2 flex size-6 items-center justify-center rounded-sm border">
              <app.logo className="size-4" />
            </div>
            {app.name}
            <DropdownMenuShortcut>{app.country}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
