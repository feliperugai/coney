import { toast } from "sonner";
import { api } from "~/trpc/react";

interface UpdateCategoryProps {
  onSuccess?: () => void | Promise<void>;
}

export function useUpdateSubcategory({ onSuccess }: UpdateCategoryProps) {
  const utils = api.useUtils();

  const {
    mutate: updateSubcategory,
    isPending: isUpdating,
    ...mutation
  } = api.subcategory.update.useMutation({
    onSuccess: async () => {
      await utils.subcategory.getAll.invalidate();

      if (onSuccess) await onSuccess?.();
      toast.success("Subcategoria atualizada");
    },
  });

  return {
    updateSubcategory,
    isUpdating,
    ...mutation,
  };
}
