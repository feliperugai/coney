import { toast } from "sonner";
import { api } from "~/trpc/react";

interface UpdateIncomeProps {
  onSuccess?: () => void | Promise<void>;
}

export function useUpdateIncome({ onSuccess }: UpdateIncomeProps) {
  const utils = api.useUtils();

  const {
    mutate: updateIncome,
    isPending: isUpdating,
    ...mutation
  } = api.income.update.useMutation({
    onSuccess: async () => {
      await utils.income.getAll.invalidate();

      if (onSuccess) await onSuccess?.();
      toast.success("Renda atualizada 😎");
    },
  });

  return {
    updateIncome,
    isUpdating,
    ...mutation,
  };
}
