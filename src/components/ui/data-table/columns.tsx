/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type ColumnDef, type Row } from "@tanstack/react-table";

// Extende o tipo ColumnDef<Transaction> com propriedades adicionais
export type Column<T> = ColumnDef<T> & {
  center?: boolean;
  date?: true | string;
  filterOptions?: {
    label: string;
    value: string;
  }[];
};

import { format } from "date-fns";
import React from "react";
import { cn } from "~/lib/utils";
import SelectFilter from "./header/select-filter";
import SortButton from "./header/sort-button";

export function sort<T>(a: Row<T>, b: Row<T>, columnId: string) {
  const valueA: any = a.getValue(columnId);
  const valueB: any = b.getValue(columnId);

  if (valueA === valueB) {
    return 0;
  }

  if (valueA < valueB) return -1;

  if (valueA === null) {
    return 1;
  }

  if (valueB === null) {
    return -1;
  }

  return 1;
}

type Path = string | number | (string | number)[];
const get = <T, U>(
  obj: T,
  path: Path,
  defaultValue: U = undefined as U,
): U | undefined => {
  const travel = (regexp: RegExp): any =>
    String(path)
      .split(regexp)
      .filter(Boolean)
      .reduce((res: any, key: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return res !== null && res !== undefined
          ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            res[key as keyof typeof res]
          : res;
      }, obj);

  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return result === undefined || result === obj ? defaultValue : result;
};
export function getColumns<T>(columns: Column<T>[]): ColumnDef<T>[] {
  const data = columns.map((item: any) => {
    if (item.meta?.options) {
      item.header = ({ column }: any) => (
        <div className={cn(item.center && "text-center")}>
          <SelectFilter
            label={item.header as string}
            column={column}
            options={item.meta?.options}
          />
        </div>
      );
    }

    if (item.enableSorting) {
      if (!item.sortingFn) item.sortingFn = sort;

      if (typeof item.header === "string") {
        item.header = ({ column }: any) => (
          <div className={cn(item.center && "text-center")}>
            <SortButton column={column} label={item.header as string} />
          </div>
        );
      }
    }

    if (item.date && item.accessorKey) {
      item.cell = ({ row }: any) => {
        const value = get(row.original, item.accessorKey);
        const formatStr =
          typeof item.date === "string" ? item.date : "dd/MM/yyyy";

        return (
          <div className={cn(item.center && "text-center")}>
            {value ? format(new Date(value as string), formatStr) : "-"}
          </div>
        );
      };
    }

    if (!item.cell) {
      item.cell = ({ row }: any) => {
        const value = get(row.original, item.accessorKey);
        return (
          <div className={cn(item.center && "text-center")}>
            {value as string}
          </div>
        );
      };
    }

    return item as ColumnDef<T>;
  });

  return data;
}
