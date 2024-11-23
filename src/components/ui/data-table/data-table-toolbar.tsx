"use client";

import { type Table } from "@tanstack/react-table";
import { Input } from "~/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <Input
        placeholder={"Filtrar"}
        value={(table.getState().globalFilter as string) ?? ""}
        onChange={(event) => table.setGlobalFilter(event.target.value)}
        className="w-[150px] lg:w-[250px]"
      />
      <DataTableViewOptions table={table} />
    </div>
  );
}
