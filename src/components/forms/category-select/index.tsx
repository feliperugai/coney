import { useFormContext, useWatch } from "react-hook-form";
import { FormAutoComplete } from "~/components/ui/autocomplete";
import { useCreateCategory } from "~/hooks/data/categories/useCreateCategory";
import { useCreateSubcategory } from "~/hooks/data/subcategories/useCreateSubcategory";
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
  subcategoryKey,
  loading,
  ...props
}: CategorySelectProps) {
  const form = useFormContext();
  const { data, isLoading, refetch } = api.category.getAll.useQuery();
  const { mutateAsync, isCreating } = useCreateCategory();

  async function createCategory(name: string) {
    try {
      const category = await mutateAsync({
        name: name,
      });

      await refetch();

      if (!category?.id) return "";

      form.setValue(subcategoryKey, undefined);
      return category.id;
    } catch (error) {
      console.error(error);
      return "";
    }
  }
  return (
    <FormAutoComplete
      name={categoryKey}
      className="flex-1"
      label="Categoria"
      placeholder="Selecione uma categoria"
      loading={isLoading ?? loading ?? isCreating}
      onAddNewItem={createCategory}
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

  const { data, isLoading, refetch } = api.subcategory.getByCategoryId.useQuery(
    category,
    {
      enabled: !!category,
    },
  );

  const { mutateAsync, isCreating } = useCreateSubcategory();

  async function createSubcategory(name: string) {
    try {
      const subcategory = await mutateAsync({
        name: name,
        categoryId: category,
      });

      await refetch();

      if (!subcategory?.id) {
        return "";
      }

      return subcategory.id;
    } catch (error) {
      console.error(error);
      return "";
    }
  }

  return (
    <FormAutoComplete
      name={subcategoryKey}
      label="Subcategoria"
      className="flex-1"
      placeholder="Selecione uma subcategoria"
      loading={isLoading ?? loading ?? isCreating}
      onAddNewItem={createSubcategory}
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
    <div className="flex items-center gap-4">
      <CategorySelect {...props} />
      <SubcategorySelect {...props} />
    </div>
  );
}
