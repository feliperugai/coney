import {
  CircleDollarSign,
  Home,
  List,
  ListTree,
  UserPlus,
  Wallet,
} from "lucide-react";
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
              label: "Início",
              href: "/",
              icon: <Home className="mr-2 h-4 w-4" />,
            },
          ],
        },
        {
          groupLabel: "Despesas",
          menus: [
            {
              label: "Despesas variáveis",
              href: "/despesas-variaveis",
              icon: <List className="mr-2 h-4 w-4" />,
            },
          ],
        },
        {
          groupLabel: "Cadastros",
          menus: [
            {
              label: "Categorias",
              href: "/categorias",
              icon: <List className="mr-2 h-4 w-4" />,
            },
            {
              label: "Subcategorias",
              href: "/subcategorias",
              icon: <ListTree className="mr-2 h-4 w-4" />,
            },
            {
              label: "Beneficiários",
              href: "/beneficiarios",
              icon: <UserPlus className="mr-2 h-4 w-4" />,
            },
            {
              label: "Meios de pagamento",
              href: "/meios-de-pagamento",
              icon: <Wallet className="mr-2 h-4 w-4" />,
            },
            {
              label: "Renda",
              href: "/renda",
              icon: <CircleDollarSign className="mr-2 h-4 w-4" />,
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
