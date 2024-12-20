"use client";

import { type Table } from "@tanstack/react-table";
import { Input } from "~/components/ui/input";
import { DataTableViewOptions } from "./actions";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onDelete?: (selectedRows: TData[]) => void;
}

export function DataTableToolbar<TData>({
  table,
  onDelete,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <Input
        placeholder={"Filtrar"}
        value={(table.getState().globalFilter as string) ?? ""}
        onChange={(event) => table.setGlobalFilter(event.target.value)}
        className="w-[150px] lg:w-[250px]"
      />
      <DataTableViewOptions table={table} onDelete={onDelete} />
    </div>
  );
}
