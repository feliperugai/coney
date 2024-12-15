import {
  type ComboboxProps,
  FormAutoComplete,
} from "~/components/ui/autocomplete";
import { api } from "~/trpc/react";

export default function UsersSelect({
  label = "Usuário",
  ...props
}: ComboboxProps) {
  const { data, isLoading } = api.user.getAll.useQuery();
  return (
    <FormAutoComplete
      {...props}
      label={label}
      loading={isLoading}
      items={data?.map((item) => ({
        value: item.id,
        label: item.name!,
        image: item.image,
      }))}
    />
  );
}
