import { type Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import React from "react";
import { Toggle } from "~/components/ui/toggle";
import { cn } from "~/lib/utils";

interface SortButtonProps<T> {
  column: Column<T>;
  label?: string;
  className?: string;
}

export default function SortButton<T>({
  column,
  label,
  className,
}: SortButtonProps<T>) {
  const isSorting = column.getIsSorted();
  console.log({ label });
  const Icon = !isSorting
    ? ArrowUpDown
    : isSorting === "asc"
      ? ArrowUp
      : ArrowDown;

  return (
    <Toggle
      className={cn("text-foreground", className)}
      onClick={() => column.toggleSorting()}
      value={isSorting !== false ? "on" : "off"}
    >
      {label}
      <Icon className="ml-2 size-4" />
    </Toggle>
  );
}
