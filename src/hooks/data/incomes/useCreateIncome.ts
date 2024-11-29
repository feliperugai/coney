import { toast } from "sonner";
import { api } from "~/trpc/react";

interface CreateIncomeProps {
  onSuccess?: () => void | Promise<void>;
}

export function useCreateIncome({ onSuccess }: CreateIncomeProps) {
  const utils = api.useUtils();

  const {
    mutate: createIncome,
    isPending: isCreating,
    ...mutation
  } = api.income.create.useMutation({
    onSuccess: async () => {
      await utils.income.getAll.invalidate();

      if (onSuccess) await onSuccess?.();
      toast.success("Nova renda adicionada 🤑");
    },
  });

  return {
    createIncome,
    isCreating,
    ...mutation,
  };
}
