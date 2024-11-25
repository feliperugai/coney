import { Folder, Home } from "lucide-react";
import { auth } from "~/server/auth";
import AdminPanelLayoutClient from "./client";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <AdminPanelLayoutClient
      menu={[
        {
          groupLabel: "Dashboard",
          menus: [
            {
              label: "Dashboard",
              href: "/",
              icon: <Home className="mr-2 h-4 w-4" />,
            },
            {
              label: "Categorias",
              href: "/categories",
              icon: <Folder className="mr-2 h-4 w-4" />,
            },
            {
              label: "Subcategorias",
              href: "/subcategories",
              icon: <Folder className="mr-2 h-4 w-4" />,
            },
          ],
        },
      ]}
      user={session!.user}
    >
      {children}
    </AdminPanelLayoutClient>
  );
}
