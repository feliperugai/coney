import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

interface NavigationMenuProps {
  item: Group;
}

export default function NavigationMenu({ item }: NavigationMenuProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === href;
    return pathname.includes(href);
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{item.groupLabel}</SidebarGroupLabel>
      <SidebarMenu>
        {item.menus.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
              asChild
              tooltip={item.label}
              isActive={isActive(item.href)}
            >
              <a href={item.href}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
