import { toast } from "sonner";
import { api } from "~/trpc/react";

interface CreateInstallmentPurchaseProps {
  onSuccess?: () => void | Promise<void>;
}

export function useCreateInstallmentPurchase({
  onSuccess,
}: CreateInstallmentPurchaseProps) {
  const utils = api.useUtils();

  const {
    mutate: createInstallmentPurchase,
    isPending: isCreating,
    ...mutation
  } = api.installmentPurchases.create.useMutation({
    onSuccess: async () => {
      await utils.installmentPurchases.getAll.invalidate();

      if (onSuccess) await onSuccess();
      toast.success("Compra parcelada adicionada com sucesso");
    },
  });

  return {
    createInstallmentPurchase,
    isCreating,
    ...mutation,
  };
}
