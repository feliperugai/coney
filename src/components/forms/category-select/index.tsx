import { useWatch } from "react-hook-form";
import { FormSelect } from "~/components/ui/select";
import { api } from "~/trpc/react";

interface CategorySelectProps {
  categoryKey: string;
  subcategoryKey: string;
  description?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  nullable?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  readonly?: boolean;
  loading?: boolean;
}

export function CategorySelect({
  categoryKey,
  loading,
  ...props
}: CategorySelectProps) {
  const { data, isLoading } = api.category.getAll.useQuery();
  return (
    <FormSelect
      name={categoryKey}
      label="Subcategoria"
      placeholder="Selecione uma subcategoria"
      loading={isLoading || loading}
      items={
        data?.map((item) => ({
          value: item.id,
          label: item.name,
        })) ?? []
      }
      {...props}
    />
  );
}

export function SubcategorySelect({
  subcategoryKey,
  categoryKey,
  disabled,
  loading,
  ...props
}: CategorySelectProps) {
  const category = useWatch({ name: categoryKey });

  const { data, isLoading } = api.subcategory.getByCategoryId.useQuery(
    category,
    {
      enabled: !!category,
    },
  );

  return (
    <FormSelect
      name={subcategoryKey}
      label="Subcategoria"
      placeholder="Selecione uma subcategoria"
      loading={isLoading || loading}
      items={
        data?.map((item) => ({
          value: item.id,
          label: item.name,
        })) ?? []
      }
      disabled={!category || disabled}
      {...props}
    />
  );
}

export function FormCategorySelect(props: CategorySelectProps) {
  return (
    <>
      <CategorySelect {...props} />
      <SubcategorySelect {...props} />
    </>
  );
}