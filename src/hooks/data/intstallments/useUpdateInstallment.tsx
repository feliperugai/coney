import { toast } from "sonner";
import { api } from "~/trpc/react";

interface UpdateCategoryProps {
  onSuccess?: () => void | Promise<void>;
}

export function useUpdateInstallmentPurchase({
  onSuccess,
}: UpdateCategoryProps) {
  const utils = api.useUtils();

  const {
    mutate: updateInstallmentPurchase,
    isPending: isUpdating,
    ...mutation
  } = api.installmentPurchases.update.useMutation({
    onSuccess: async () => {
      await utils.installmentPurchases.getAll.invalidate();

      if (onSuccess) await onSuccess();
      toast.success("Compra parcelada atualizada com sucesso");
    },
  });

  return {
    updateInstallmentPurchase,
    isUpdating,
    ...mutation,
  };
}
