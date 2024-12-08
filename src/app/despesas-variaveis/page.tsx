"use client";

import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { type DateRange } from "react-day-picker";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { DateRangePicker } from "~/components/ui/date-range-picker";
import useDeleteTransaction from "~/hooks/data/transactions/useDeleteTransaction";
import { getStartOfMonth } from "~/lib/date";
import { type Transaction } from "~/server/db/tables/transactions";
import { api } from "~/trpc/react";
import { columns } from "./_components/columns";
import TransactionDialog from "./_components/modal";

function getTransaction(data: Transaction[] | undefined, id: string | null) {
  if (!data) return undefined;
  const found = data.find((cat) => cat.id === id);
  return found ? { ...found, amount: parseFloat(found.amount) } : undefined;
}

export default function CategoriesPage() {
  const [transactionId, setTransactionId] = useQueryState("transactionId");
  const [range, setRange] = useState<DateRange>({
    from: getStartOfMonth(),
    to: new Date(),
  });
  const { data, isLoading, refetch } = api.transaction.getAll.useQuery({
    startDate: format(range.from!, "yyyy-MM-dd"),
    endDate: format(range.to!, "yyyy-MM-dd"),
  });

  const { mutate } = useDeleteTransaction();
  const selectedTransaction = getTransaction(data, transactionId);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Despesas variáveis</h1>
        <DateRangePicker
          onUpdate={({ range }) => setRange(range)}
          initialDateFrom={getStartOfMonth()}
          initialDateTo={new Date()}
          align="start"
          locale="pt-BR"
          showCompare={false}
        />
        <Button onClick={() => setTransactionId("new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nova
        </Button>
      </div>

      <DataTable
        loading={isLoading}
        onClick={async (transaction) =>
          void (await setTransactionId(transaction.id))
        }
        onDelete={(rows) => {
          mutate({ ids: rows.map((row) => row.id) });
        }}
        columns={columns}
        data={data}
        enableRowSelection
      />

      {transactionId && (
        <TransactionDialog
          open={transactionId !== null}
          onOpenChange={async (open) => {
            if (!open) await setTransactionId(null);
          }}
          initialData={
            transactionId === "new" ? undefined : selectedTransaction
          }
        />
      )}
    </div>
  );
}
