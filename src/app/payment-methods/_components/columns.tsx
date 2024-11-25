import { type ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import useDeletePaymentMethod from "~/hooks/data/payment-methods/useDeletePaymentMethod";
import { type PaymentMethod } from "~/server/db/tables/payment-method";

export const columns: ColumnDef<PaymentMethod>[] = [
  {
    accessorKey: "color",
    header: "Cor",
    cell: function Cell({ row }) {
      return (
        <div
          className="size-6 rounded-md"
          style={{ background: row.original.color }}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: function Cell({ row }) {
      const { mutate: deletePaymentMethod, isPending } =
        useDeletePaymentMethod();

      return (
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              deletePaymentMethod({ id: row.original.id });
            }}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Excluir"
            )}
          </Button>
        </div>
      );
    },
  },
];
