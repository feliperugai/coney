import { toast } from "sonner";
import { api } from "~/trpc/react";

export default function useDeleteIncome() {
  const utils = api.useUtils();

  const mutation = api.income.deleteMany.useMutation({
    onSuccess: async () => {
      await utils.income.getAll.invalidate();
      toast.success("Renda excluída 😭");
    },
  });

  return mutation;
}
