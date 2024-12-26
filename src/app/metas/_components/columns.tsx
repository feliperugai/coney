import CurrencyCell from "~/components/ui/data-table/cells/money-cell";
import { type Column } from "~/components/ui/data-table/columns";
import { type Goals } from "~/server/api/routers/goal";

export const columns: Column<Goals[0]>[] = [
  {
    accessorKey: "startDate",
    header: "De",
    date: "dd/MM/yyyy",
  },
  {
    accessorKey: "endDate",
    header: "Até",
    date: "dd/MM/yyyy",
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => <CurrencyCell value={row.original.amount} />,
  },
  {
    accessorKey: "category.name",
    header: "Categoria / Subcategoria",
    enableSorting: false,
    cell: ({ row }) => (
      <div>
        {row.original.category?.name}{" "}
        {row.original.subcategory?.name ? "/" : ""}{" "}
        {row.original.subcategory?.name}
      </div>
    ),
  },
];
