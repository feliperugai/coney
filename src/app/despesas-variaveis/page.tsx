"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/data-table";
import {
  EditActionsCell,
  EditableCell,
} from "~/components/ui/data-table/cells/editable-cell";

// Exemplo de uso
export default function Page() {
  type Student = {
    studentId: number;
    name: string;
    dateOfBirth: string;
    major: string;
  };

  const defaultData: Student[] = [
    {
      studentId: 1111,
      name: "Bahar Constantia",
      dateOfBirth: "1984-01-04",
      major: "Computer Science",
    },
    {
      studentId: 2222,
      name: "Harold Nona",
      dateOfBirth: "1961-05-10",
      major: "Communications",
    },
  ];

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "studentId",
      header: "Student ID",
      cell: EditableCell,
      meta: {
        type: "number",
      },
    },
    {
      accessorKey: "name",
      header: "Full Name",
      cell: EditableCell,
      meta: {
        type: "text",
      },
    },
    {
      accessorKey: "dateOfBirth",
      header: "Date Of Birth",
      cell: EditableCell,
      meta: {
        type: "date",
      },
    },
    {
      accessorKey: "major",
      header: "Major",
      cell: EditableCell,
      meta: {
        type: "select",
        options: [
          { value: "Computer Science", label: "Computer Science" },
          { value: "Communications", label: "Communications" },
          { value: "Business", label: "Business" },
          { value: "Psychology", label: "Psychology" },
        ],
      },
    },
    {
      id: "edit",
      cell: EditActionsCell,
    },
  ];

  return (
    <div className="p-4">
      <DataTable data={defaultData} columns={columns} />
    </div>
  );
}
