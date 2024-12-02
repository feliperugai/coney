import { type ColumnDef } from "@tanstack/react-table";
import { EditActionsCell } from "~/components/ui/data-table/cells/editable-cell";
import CurrencyCell from "~/components/ui/data-table/cells/money-cell";

import { type Transaction } from "~/server/db/tables/transactions";

export const columns: ColumnDef<Transaction>[] = [
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
  },
  {
    accessorKey: "subcategory.name",
    header: "Subategoria",
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: EditActionsCell,
  },
];
