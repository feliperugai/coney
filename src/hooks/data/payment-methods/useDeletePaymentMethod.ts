import { toast } from "sonner";
import { api } from "~/trpc/react";

export default function useDeletePaymentMethod() {
  const utils = api.useUtils();

  const mutation = api.paymentMethod.deleteMany.useMutation({
    onSuccess: async () => {
      await utils.paymentMethod.getAll.invalidate();
      toast.success("Método de pagamento excluído");
    },
  });

  return mutation;
}
