"use client";

import { Loader2, Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { UploadButton } from "~/components/uploadthing";
import { api } from "~/trpc/react";
import { columns } from "./_components/columns";
import PaymentMethodDialog from "./_components/modal";

export default function PaymentMethodsPage() {
  const [paymentMethodId, setPaymentMethodId] =
    useQueryState("paymentMethodId");

  const { data, isLoading } = api.paymentMethod.getAll.useQuery();
  const selectedPaymentMethod = data?.find((p) => p.id === paymentMethodId);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Métodos de pagamento</h1>
        <Button onClick={() => setPaymentMethodId("new")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Método de Pagamento
        </Button>
      </div>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      <DataTable
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
