import { toast } from "sonner";
import { api } from "~/trpc/react";

interface CreateCategoryProps {
  onSuccess?: () => void | Promise<void>;
}

export function useCreateCategory({ onSuccess }: CreateCategoryProps = {}) {
  const utils = api.useUtils();

  const {
    mutate: createCategory,
    isPending: isCreating,
    ...mutation
  } = api.category.create.useMutation({
    onSuccess: async () => {
      await utils.category.getAll.invalidate();

      if (onSuccess) await onSuccess?.();

      toast.success("Categoria criada");
    },
  });

  return {
    createCategory,
    isCreating,
    ...mutation,
  };
}
