import { type ColumnDef } from "@tanstack/react-table";
import {
  VisualizationCell,
  VisualizationHeader,
} from "~/components/ui/data-table/cells/visualization-cell";
import { type PaymentMethod } from "~/server/db/tables/payment-method";

export const columns: ColumnDef<PaymentMethod>[] = [
  {
    accessorKey: "color",
    header: VisualizationHeader,
    cell: ({ row }) => <VisualizationCell data={row.original} />,
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
];
