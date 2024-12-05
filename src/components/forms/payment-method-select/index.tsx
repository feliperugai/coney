import React from "react";
import { FormAutoComplete } from "~/components/ui/autocomplete";
import { api } from "~/trpc/react";

interface PaymentMethodSelectProps {
  name: string;
  label?: string;
}

export default function PaymentMethodSelect({
  name,
  label = "Forma de pagamento",
}: PaymentMethodSelectProps) {
  const { data, isLoading } = api.paymentMethod.getAll.useQuery();

  return (
    <FormAutoComplete
      name={name}
      label={label}
      items={
        data?.map((item) => ({
          value: item.id,
          label: item.name,
          image: item.image,
        })) ?? []
      }
      isLoading={isLoading}
    />
  );
}
