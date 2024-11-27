import { toast } from "sonner";
import { api } from "~/trpc/react";

interface CreateRecipientProps {
  onSuccess?: () => void | Promise<void>;
}

export function useCreateRecipient({ onSuccess }: CreateRecipientProps) {
  const utils = api.useUtils();

  const {
    mutate: createRecipient,
    isPending: isCreating,
    ...mutation
  } = api.recipient.create.useMutation({
    onSuccess: async () => {
      await utils.recipient.getAll.invalidate();

      if (onSuccess) await onSuccess?.();
      toast.success("Subcategoria criada");
    },
  });

  return {
    createRecipient,
    isCreating,
    ...mutation,
  };
}
