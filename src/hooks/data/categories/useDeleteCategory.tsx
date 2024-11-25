import { toast } from "sonner";
import { api } from "~/trpc/react";

export default function useDeleteCategory() {
  const utils = api.useUtils();

  const mutation = api.category.delete.useMutation({
    onSuccess: async () => {
      await utils.category.getAll.invalidate();
      toast.success("Categoria excluída");
    },
  });

  return mutation;
}
