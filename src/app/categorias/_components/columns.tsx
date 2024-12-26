import { type ColumnDef } from "@tanstack/react-table";
import {
  VisualizationCell,
  VisualizationHeader,
} from "~/components/ui/data-table/cells/visualization-cell";
import { type Category } from "~/server/db/tables/categories";

export const columns: ColumnDef<Category>[] = [
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
