import { type ColumnDef } from "@tanstack/react-table";
import CurrencyCell from "~/components/ui/data-table/cells/money-cell";
import MonthDayCell from "~/components/ui/data-table/cells/month-day-cell";
import { type Income } from "~/server/db/tables/income";

export const columns: ColumnDef<Income>[] = [
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: function AmountCell({ row }) {
      return <CurrencyCell value={row.original.amount} variant="income" />;
    },
  },
  {
    accessorKey: "day",
    header: "Dia do mês",
    cell: function Cell({ row }) {
      return <MonthDayCell nthBusinessDay={row.original.nthBusinessDay} />;
    },
  },
];
