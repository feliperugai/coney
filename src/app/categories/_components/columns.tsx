import { type ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import useDeleteCategory from "~/hooks/data/categories/useDeleteCategory";
import { type Category } from "~/server/db/tables/categories";

export const columns: ColumnDef<Category>[] = [
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
