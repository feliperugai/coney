import CurrencyCell from "~/components/ui/data-table/cells/money-cell";
import { type Column } from "~/components/ui/data-table/columns";

import { type Transaction } from "~/server/db/tables/transactions";

export const columns: Column<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Dia",
    date: "dd",
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => <CurrencyCell value={row.original.amount} />,
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "category.name",
    header: "Categoria",
    enableSorting: false,
  },
  {
    accessorKey: "subcategory.name",
    header: "Subategoria",
    enableSorting: false,
  },
];
