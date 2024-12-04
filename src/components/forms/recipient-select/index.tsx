import React from "react";
import { FormAutoComplete } from "~/components/ui/autocomplete";
import { api } from "~/trpc/react";

interface RecipientSelectProps {
  name: string;
  label?: string;
}

export default function ReceipientSelect({
  name,
  label = "Destinatário",
}: RecipientSelectProps) {
  const { data, isLoading } = api.recipient.getAll.useQuery();

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
