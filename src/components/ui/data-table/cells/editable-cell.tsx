"use client";

import {
  type Column,
  type Table as ReactTable,
  type Row,
} from "@tanstack/react-table";
import { Check, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type Option = {
  label: string;
  value: string;
};

type TableCellProps<T> = {
  getValue: () => any;
  row: Row<T>;
  column: Column<T, unknown>;
  table: ReactTable<T>;
};

type EditCellProps<T> = {
  row: Row<T>;
  table: ReactTable<T>;
};

type TableMetaType<T> = {
  type?: T;
  editedRows: Record<string, boolean>;
  setEditedRows: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  revertData: (rowIndex: number, revert: boolean) => void;
  updateData: (rowIndex: number, columnId: string, value: string) => void;
};

export function EditableCell<T>({
  getValue,
  row,
  column,
  table,
}: TableCellProps<T>) {
  const initialValue = getValue();
  const columnMeta = column.columnDef.meta as {
    type?: string;
    options?: Option[];
  };
  const tableMeta = table.options.meta as TableMetaType<T>;
  const [value, setValue] = useState<string | number>(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    tableMeta?.updateData(row.index, column.id, String(value));
  };

  const onSelectChange = (selectedValue: string) => {
    setValue(selectedValue);
    tableMeta?.updateData(row.index, column.id, selectedValue);
  };

  if (tableMeta?.editedRows[row.id]) {
    return columnMeta?.type === "select" ? (
      <Select value={String(initialValue)} onValueChange={onSelectChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {columnMeta?.options?.map((option: Option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <Input
        value={String(value)}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        type={columnMeta?.type ?? "text"}
      />
    );
  }
  return <span>{value}</span>;
}

export function EditActionsCell<T>({ row, table }: EditCellProps<T>) {
  const meta = table.options.meta as TableMetaType<T>;

  const setEditedRows = (action: string) => {
    meta?.setEditedRows((old: Record<string, boolean>) => ({
      ...old,
      [row.id]: !old[row.id],
    }));

    if (action !== "edit") {
      meta?.revertData(row.index, action === "cancel");
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      {meta?.editedRows[row.id] ? (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setEditedRows("cancel")}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setEditedRows("done")}
          >
            <Check className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setEditedRows("edit")}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
