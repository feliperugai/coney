import { toast } from "sonner";
import { api } from "~/trpc/react";

interface CreatePaymentMethodProps {
  onSuccess?: () => void | Promise<void>;
}

export function useCreatePaymentMethod({
  onSuccess,
}: CreatePaymentMethodProps) {
  const utils = api.useUtils();

  const {
    mutate: createPaymentMethod,
    isPending: isCreating,
    ...mutation
  } = api.paymentMethod.create.useMutation({
    onSuccess: async () => {
      await utils.paymentMethod.getAll.invalidate();

      if (onSuccess) await onSuccess?.();
      toast.success("Método de pagamento criado");
    },
  });

  return {
    createPaymentMethod,
    isCreating,
    ...mutation,
  };
}
