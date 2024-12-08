import { ImageCell } from "~/components/ui/data-table/cells/image-cell";
import CurrencyCell from "~/components/ui/data-table/cells/money-cell";
import { type Column } from "~/components/ui/data-table/columns";
import { type Transactions } from "~/server/api/routers/transactions";

export const columns: Column<Transactions[0]>[] = [
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
    cell: ({ row }) => {
      const { recipient } = row.original;
      return (
        <ImageCell
          src={recipient?.image}
          color={recipient?.color}
          description={
            <div className="flex flex-col py-1">
              {recipient?.name && (
                <div className="text-xs font-semibold">{recipient.name}</div>
              )}
              <div>{row.original.description}</div>
            </div>
          }
        />
      );
    },
  },
  {
    accessorKey: "category.name",
    header: "Categoria",
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
