import {
  BarChart2,
  CreditCard,
  DollarSign,
  Home,
  Subtitles,
  Tag,
  Users,
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
              icon: <BarChart2 className="mr-2 h-4 w-4" />,
            },
            {
              label: "Compras parceladas",
              href: "/compras-parceladas",
              icon: <CreditCard className="mr-2 h-4 w-4" />,
            },
          ],
        },
        {
          groupLabel: "Cadastros",
          menus: [
            {
              label: "Categorias",
              href: "/categorias",
              icon: <Tag className="mr-2 h-4 w-4" />,
            },
            {
              label: "Subcategorias",
              href: "/subcategorias",
              icon: <Subtitles className="mr-2 h-4 w-4" />,
            },
            {
              label: "Beneficiários",
              href: "/beneficiarios",
              icon: <Users className="mr-2 h-4 w-4" />,
            },
            {
              label: "Meios de pagamento",
              href: "/meios-de-pagamento",
              icon: <Wallet className="mr-2 h-4 w-4" />,
            },
            {
              label: "Renda",
              href: "/renda",
              icon: <DollarSign className="mr-2 h-4 w-4" />,
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
