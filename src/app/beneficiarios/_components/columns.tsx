import { type ColumnDef } from "@tanstack/react-table";
import {
  VisualizationCell,
  VisualizationHeader,
} from "~/components/ui/data-table/cells/visualization-cell";
import { type Recipient } from "~/server/db/tables/recipients";

export const columns: ColumnDef<Recipient>[] = [
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
    accessorKey: "category.name",
    header: "Categoria",
  },
  {
    accessorKey: "subcategory.name",
    header: "Subategoria",
  },
  // {

  //   accessorKey: "actions",
  //   header: "Ações",
  //   cell: function Cell({ row }) {
  //     const { mutate: deleteRecipient, isPending } = useDeleteRecipient();

  //     return (
  //       <div className="flex gap-2">
  //         <Button
  //           variant="destructive"
  //           size="sm"
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             deleteRecipient({ id: row.original.id });
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
