import { toast } from "sonner";
import { api } from "~/trpc/react";

export default function useDeleteSubcategory() {
  const utils = api.useUtils();

  const mutation = api.installmentPurchases.deleteMany.useMutation({
    onSuccess: async () => {
      await utils.installmentPurchases.getAll.invalidate();
      toast.success("Compras parceladas removidas com sucesso");
    },
  });

  return mutation;
}
