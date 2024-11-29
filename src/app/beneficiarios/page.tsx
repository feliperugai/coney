"use client";

import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/react";
import { columns } from "./_components/columns";
import RecipientDialog from "./_components/modal";
import useDeleteRecipient from "~/hooks/data/recipients/useDeleteRecipient";

export default function RecipientsPage() {
  const [recipientId, setRecipientId] = useQueryState("recipientId");
  const { data, isLoading } = api.recipient.getAll.useQuery();
  const { mutate } = useDeleteRecipient();
  const selectedRecipient = data?.find((cat) => cat.id === recipientId);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Beneficiários</h1>
        <Button onClick={() => setRecipientId("new")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo
        </Button>
      </div>

      <DataTable
        loading={isLoading}
        onDelete={(rows) => {
          mutate({ ids: rows.map((row) => row.id!) });
        }}
        onClick={async (recipient) => {
          if (recipient.id) await setRecipientId(recipient.id);
        }}
        columns={columns}
        data={data}
        enableRowSelection
      />

      {recipientId && (
        <RecipientDialog
          open={recipientId !== null}
          onOpenChange={async (open) => {
            if (!open) await setRecipientId(null);
          }}
          initialData={recipientId === "new" ? undefined : selectedRecipient}
        />
      )}
    </div>
  );
}
