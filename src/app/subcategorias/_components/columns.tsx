import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  VisualizationCell,
  VisualizationHeader,
} from "~/components/ui/data-table/cells/visualization-cell";
import { type Subcategory } from "~/server/db/tables/subcategories";

export const columns: ColumnDef<Subcategory>[] = [
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
  {
    accessorKey: "categoryId",
    header: "Categoria",
    cell: function Cell({ row }) {
      return (
        <Link
          className="underline hover:no-underline"
          href={`/categorias?categoryId=${row.original.categoryId}`}
        >
          {row.original.category.name}
        </Link>
      );
    },
  },
];
