"use client";

import { type Table } from "@tanstack/react-table";
import { FlipHorizontal2, Trash } from "lucide-react";
import { DeleteButton } from "~/components/buttons/delete-button";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

// Adicionando tipo genérico para o hook
interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  onDelete?: (selectedRows: TData[]) => void; // Função para deletar registros
}

export function DataTableViewOptions<TData>({
  table,
  onDelete,
}: DataTableViewOptionsProps<TData>) {
  // Obter registros selecionados
  const selectedRows = table.getSelectedRowModel().rows;

  return (
    <div className="flex items-center space-x-4">
      {selectedRows.length > 0 && onDelete && (
        <DeleteButton
          size="sm"
          displayName={
            selectedRows.length > 1 ? "itens selecionados" : "item selecionado"
          }
          onConfirm={() => {
            onDelete(selectedRows.map((row) => row.original));
            table.resetRowSelection();
          }}
        >
          <Trash className="size-4" />
        </DeleteButton>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <FlipHorizontal2 className="mr-2 h-4 w-4" />
            Colunas
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Habilitar</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide(),
            )
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
