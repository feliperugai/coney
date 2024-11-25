import { toast } from "sonner";
import { api } from "~/trpc/react";

interface UpdatePaymentMethodProps {
  onSuccess?: () => void | Promise<void>;
}

export function useUpdatePaymentMethod({
  onSuccess,
}: UpdatePaymentMethodProps) {
  const utils = api.useUtils();

  const {
    mutate: updatePaymentMethod,
    isPending: isUpdating,
    ...mutation
  } = api.paymentMethod.update.useMutation({
    onSuccess: async () => {
      await utils.paymentMethod.getAll.invalidate();

      if (onSuccess) await onSuccess?.();
      toast.success("Método de pagamento atualizado");
    },
  });

  return {
    updatePaymentMethod,
    isUpdating,
    ...mutation,
  };
}
