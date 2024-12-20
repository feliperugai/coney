import { toast } from "sonner";
import { api } from "~/trpc/react";

interface UpdateCategoryProps {
  onSuccess?: () => void | Promise<void>;
}

export function useUpdateCategory({ onSuccess }: UpdateCategoryProps) {
  const utils = api.useUtils();

  const {
    mutate: updateCategory,
    isPending: isUpdating,
    ...mutation
  } = api.category.update.useMutation({
    onSuccess: async () => {
      await utils.category.getAll.invalidate();

      if (onSuccess) await onSuccess?.();

      toast.success("Categoria atualizada");
    },
  });

  return {
    updateCategory,
    isUpdating,
    ...mutation,
  };
}
