"use client";

import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import useDeleteIncome from "~/hooks/data/incomes/useDeleteIncome";
import { api } from "~/trpc/react";
import { columns } from "./_components/columns";
import IncomeDialog from "./_components/modal";

export default function IncomesPage() {
  const [incomeId, setIncomeId] = useQueryState("incomeId");

  const { data, isLoading } = api.income.getAll.useQuery();
  const { mutate } = useDeleteIncome();

  const selectedIncome = data?.find((p) => p.id === incomeId);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Renda</h1>
        <Button onClick={() => setIncomeId("new")}>
          <Plus className="mr-2 size-4" />
          Nova
        </Button>
      </div>
      <DataTable
        loading={isLoading}
        onClick={async (income) => void (await setIncomeId(income.id))}
        columns={columns}
        onDelete={(selectedRows) => {
          mutate({ ids: selectedRows.map((row) => row.id) });
        }}
        data={data}
        enableRowSelection
      />

      {incomeId && (
        <IncomeDialog
          initialData={incomeId === "new" ? undefined : (selectedIncome as any)}
          open={incomeId !== null}
          onOpenChange={async (open) => {
            if (!open) await setIncomeId(null);
          }}
        />
      )}
    </div>
  );
}
