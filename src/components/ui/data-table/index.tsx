"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { CheckboxCell } from "./cells/checkbox-cell";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { TableSkeleton } from "./row-skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  onClick?: (row: TData) => Promise<void> | void;
  onDelete?: (selectedRows: TData[]) => void;
  enableRowSelection?: boolean;
  hideFilter?: boolean;
  loading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data: initialData = [],
  enableRowSelection,
  hideFilter,
  loading,
  onDelete,
  onClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<TData[]>([]);
  const [originalData, setOriginalData] = useState<TData[]>([]);
  const [editedRows, setEditedRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData.length) setData(initialData);
  }, [initialData]);

  const table = useReactTable({
    data,
    columns: enableRowSelection
      ? [CheckboxCell as ColumnDef<TData>, ...columns]
      : columns,
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      editedRows,
      setEditedRows,
      revertData: (rowIndex: number, revert: boolean) => {
        if (revert) {
          setData((old: TData[]) =>
            old.map((row, index) => {
              if (index !== rowIndex) return row;
              if (originalData[rowIndex]) return originalData[rowIndex];
              return row;
            }),
          );
        } else {
          setOriginalData((old) =>
            old.map((row, index) => {
              if (index !== rowIndex) return row;
              if (data[rowIndex]) return data[rowIndex];
              return row;
            }),
          );
        }
      },
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex && old[rowIndex]) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
    },
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="space-y-4">
      {!hideFilter && <DataTableToolbar table={table} onDelete={onDelete} />}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={async (e) => {
                    const target = e.target as HTMLElement;

                    if (target.closest("button") || target.closest("a")) {
                      return;
                    }
                    const isSelection = target.role === "checkbox";
                    const isAnchor =
                      target.tagName === "A" || target.tagName === "BUTTON";

                    if (isAnchor) {
                      return;
                    }

                    if (onClick && !isSelection) {
                      e.stopPropagation();
                      await onClick(row.original);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                  className="h-24 text-center"
                >
                  Nenhum item encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
