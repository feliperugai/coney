import { toast } from "sonner";
import { api } from "~/trpc/react";

interface UpdateCategoryProps {
  onSuccess?: () => void | Promise<void>;
}

export function useUpdateTransaction({ onSuccess }: UpdateCategoryProps) {
  const utils = api.useUtils();

  const {
    mutate: updateTransaction,
    isPending: isUpdating,
    ...mutation
  } = api.transaction.update.useMutation({
    onSuccess: async () => {
      await utils.transaction.getAll.invalidate();

      if (onSuccess) await onSuccess?.();
      toast.success("Despesa atualizada");
    },
  });

  return {
    updateTransaction,
    isUpdating,
    ...mutation,
  };
}
