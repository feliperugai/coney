import { toast } from "sonner";
import { api } from "~/trpc/react";

interface CreateTransactionProps {
  onSuccess?: () => void | Promise<void>;
}

export function useCreateTransaction({ onSuccess }: CreateTransactionProps) {
  const utils = api.useUtils();

  const {
    mutate: createTransaction,
    isPending: isCreating,
    ...mutation
  } = api.transaction.create.useMutation({
    onSuccess: async () => {
      await utils.transaction.getAll.invalidate();

      if (onSuccess) await onSuccess?.();
      toast.success("Despesa adicionada");
    },
  });

  return {
    createTransaction,
    isCreating,
    ...mutation,
  };
}
