import { type ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  VisualizationCell,
  VisualizationHeader,
} from "~/components/ui/data-table/cells/visualization-cell";
import useDeleteSubcategory from "~/hooks/data/subcategories/useDeleteSubcategory";
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
          href={`/categories?categoryId=${row.original.categoryId}`}
        >
          {row.original.category.name}
        </Link>
      );
    },
  },
  // {
  //   accessorKey: "actions",
  //   header: "Ações",
  //   cell: function Cell({ row }) {
  //     const { mutate: deleteCategory, isPending } = useDeleteSubcategory();

  //     return (
  //       <div className="flex gap-2">
  //         <Button
  //           variant="destructive"
  //           size="sm"
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             deleteCategory({ id: row.original.id });
  //           }}
  //         >
  //           {isPending ? (
  //             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  //           ) : (
  //             "Excluir"
  //           )}
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
];
