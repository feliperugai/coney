import { type ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  VisualizationCell,
  VisualizationHeader,
} from "~/components/ui/data-table/cells/visualization-cell";
import useDeleteCategory from "~/hooks/data/categories/useDeleteCategory";
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
  {
    accessorKey: "actions",
    header: "Ações",
    cell: function Cell({ row }) {
      const { mutate: deleteCategory, isPending } = useDeleteCategory();

      return (
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              deleteCategory({ id: row.original.id });
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
