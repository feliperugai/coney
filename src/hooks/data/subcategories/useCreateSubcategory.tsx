import { toast } from "sonner";
import { api } from "~/trpc/react";

interface CreateSubcategoryProps {
  onSuccess?: () => void | Promise<void>;
}

export function useCreateSubcategory({ onSuccess }: CreateSubcategoryProps) {
  const utils = api.useUtils();

  const {
    mutate: createSubcategory,
    isPending: isCreating,
    ...mutation
  } = api.subcategory.create.useMutation({
    onSuccess: async () => {
      await utils.subcategory.getAll.invalidate();

      if (onSuccess) await onSuccess?.();
      toast.success("Subcategoria criada");
    },
  });

  return {
    createSubcategory,
    isCreating,
    ...mutation,
  };
}
