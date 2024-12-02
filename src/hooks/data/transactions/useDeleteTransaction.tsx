import { toast } from "sonner";
import { api } from "~/trpc/react";

export default function useDeleteSubcategory() {
  const utils = api.useUtils();

  const mutation = api.transaction.deleteMany.useMutation({
    onSuccess: async () => {
      await utils.transaction.getAll.invalidate();
      toast.success("Despesa removida");
    },
  });

  return mutation;
}
