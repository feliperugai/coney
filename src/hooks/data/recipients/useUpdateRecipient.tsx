import { toast } from "sonner";
import { api } from "~/trpc/react";

interface UpdateCategoryProps {
  onSuccess?: () => void | Promise<void>;
}

export function useUpdateRecipient({ onSuccess }: UpdateCategoryProps) {
  const utils = api.useUtils();

  const {
    mutate: updateRecipient,
    isPending: isUpdating,
    ...mutation
  } = api.recipient.update.useMutation({
    onSuccess: async () => {
      await utils.recipient.getAll.invalidate();

      if (onSuccess) await onSuccess?.();
      toast.success("Subcategoria atualizada");
    },
  });

  return {
    updateRecipient,
    isUpdating,
    ...mutation,
  };
}
