"use client";

import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/react";
import { columns } from "./_components/columns";
import PaymentMethodDialog from "./_components/modal";

export default function PaymentMethodsPage() {
  const [paymentMethodId, setPaymentMethodId] =
    useQueryState("paymentMethodId");

  const { data, isLoading } = api.paymentMethod.getAll.useQuery();
  const selectedPaymentMethod = data?.find((p) => p.id === paymentMethodId);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Métodos de pagamento</h1>
        <Button onClick={() => setPaymentMethodId("new")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Método de Pagamento
        </Button>
      </div>
      <DataTable
        loading={isLoading}
        onClick={async (paymentMethod) =>
          void (await setPaymentMethodId(paymentMethod.id))
        }
        columns={columns}
        data={data}
        enableRowSelection
      />

      {paymentMethodId && (
        <PaymentMethodDialog
          initialData={
            paymentMethodId === "new" ? undefined : selectedPaymentMethod
          }
          open={paymentMethodId !== null}
          onOpenChange={async (open) => {
            if (!open) await setPaymentMethodId(null);
          }}
        />
      )}
    </div>
  );
}
