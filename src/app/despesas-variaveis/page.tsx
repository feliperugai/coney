"use client";

import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/react";
import { columns } from "./_components/columns";
import TransactionDialog from "./_components/modal";

export default function CategoriesPage() {
  const [transactionId, setTransactionId] = useQueryState("transactionId");
  const { data, isLoading } = api.transaction.getAll.useQuery();
  const selectedTransaction = data?.find((cat) => cat.id === transactionId);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Despesas variáveis</h1>
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
