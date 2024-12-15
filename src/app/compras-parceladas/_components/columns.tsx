import { ImageCell } from "~/components/ui/data-table/cells/image-cell";
import CurrencyCell from "~/components/ui/data-table/cells/money-cell";
import { type Column } from "~/components/ui/data-table/columns";
import { type InstallmentPurchases } from "~/server/api/routers/installment-purchases";

export const columns: Column<InstallmentPurchases[0]>[] = [
  {
    accessorKey: "startDate",
    header: "Primeira",
    date: "dd/MM/yy",
  },
  {
    accessorKey: "endDate",
    header: "Última",
    date: "dd/MM/yy",
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => <CurrencyCell value={row.original.installmentAmount} />,
  },
  {
    accessorKey: "paymentMethod.name",
    header: "Forma de pagamento",
    cell: ({ row }) => {
      const { paymentMethod } = row.original;

      return (
        <ImageCell
          src={paymentMethod?.image}
          color={paymentMethod?.color}
          description={
            <div className="flex flex-col py-1">
              {paymentMethod?.name && (
                <div className="font-semibold">{paymentMethod.name}</div>
              )}
            </div>
          }
        />
      );
    },
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
