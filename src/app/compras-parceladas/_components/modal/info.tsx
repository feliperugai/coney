import React from "react";
import { useWatch } from "react-hook-form";
import { format } from "~/lib/currency";

export default function InstallmentInfo() {
  const amount = useWatch({ name: "amount" });
  const totalInstallments = useWatch({ name: "totalInstallments" });
  const date = useWatch({ name: "date" });

  if (!amount || !totalInstallments || !date) return null;

  const installmentAmount = format(amount / totalInstallments);
  const total = format(amount);
  
  return (
    <div>
      <p className="text-sm font-medium text-red-500">
        {totalInstallments} x {installmentAmount} = {total}
      </p>
    </div>
  );
}
