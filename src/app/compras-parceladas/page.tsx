"use client";

import { add, format } from "date-fns";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { type DateRange } from "react-day-picker";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { DateRangePicker } from "~/components/ui/date-range-picker";
import useDeleteInstallment from "~/hooks/data/intstallments/useDeleteInstallment";
import { getStartOfMonth } from "~/lib/date";
import { type InstallmentPurchase } from "~/server/db/tables/installmentsPurchases";
import { api } from "~/trpc/react";
import { columns } from "./_components/columns";
import InstallmentDialog from "./_components/modal";

function getInstallment(
  data: InstallmentPurchase[] | undefined,
  id: string | null,
) {
  if (!data) return undefined;
  const found = data.find((cat) => cat.id === id);
  return found
    ? {
        ...found,
        amount: parseFloat(found.installmentAmount),
        date: found.startDate,
      }
    : undefined;
}

export default function InstallmentsPage() {
  const [id, setId] = useQueryState("id");
  const [range, setRange] = useState<DateRange>({
    from: getStartOfMonth(),
    to: add(new Date(), { years: 1 }),
  });

  const { data, isLoading } = api.installmentPurchases.getAll.useQuery({
    startDate: format(range.from!, "yyyy-MM-dd"),
    endDate: format(range.to ?? range.from!, "yyyy-MM-dd"),
  });

  const { mutate } = useDeleteInstallment();
  const selectedInstallment = getInstallment(data, id);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Compras parceladas</h1>
        <DateRangePicker
          onUpdate={({ range }) => setRange(range)}
          initialDateFrom={range.from}
          initialDateTo={range.to}
          align="start"
          locale="pt-BR"
          showCompare={false}
        />
        <Button onClick={() => setId("new")}>
          <Plus className="mr-2 size-4" />
          Nova
        </Button>
      </div>

      <DataTable
        loading={isLoading}
        onClick={async (installment) => void (await setId(installment.id))}
        onDelete={(rows) => {
          mutate({ ids: rows.map((row) => row.id) });
        }}
        columns={columns}
        data={data}
        enableRowSelection
      />

      {id && (
        <InstallmentDialog
          open={id !== null}
          onOpenChange={async (open) => {
            if (!open) await setId(null);
          }}
          initialData={id === "new" ? undefined : selectedInstallment}
        />
      )}
    </div>
  );
}
