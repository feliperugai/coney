"use client";

import { type User } from "next-auth";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import Header from "./header";
import AppSidebar from "./sidebar";

interface ClientLayoutProps {
  children: React.ReactNode;
  menu: Group[];
  user: User;
}

export default function AdminPanelLayoutClient({
  children,
  menu,
  user,
}: ClientLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar menu={menu} user={user} />
      <main className="relative flex h-screen min-h-screen flex-1 flex-col overflow-hidden bg-background">
        <SidebarInset>
          <Header />
          <div className="flex flex-1 flex-col gap-4 overflow-auto p-4">
            {children}
          </div>
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
}
