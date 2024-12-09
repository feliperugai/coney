import React from "react";
import {
  type ComboboxProps,
  FormAutoComplete,
} from "~/components/ui/autocomplete";
import { api } from "~/trpc/react";

export default function RecipientSelect({
  label = "Destinatário",
  ...props
}: ComboboxProps) {
  const { data, isLoading } = api.recipient.getAll.useQuery();

  return (
    <FormAutoComplete
      {...props}
      label={label}
      newItemProp="newRecipient"
      loading={isLoading}
      items={
        data?.map((item) => ({
          value: item.id,
          label: item.name,
          image: item.image,
        })) ?? []
      }
    />
  );
}
