import { toast } from "sonner";
import { api } from "~/trpc/react";

export default function useDeleteSubcategory() {
  const utils = api.useUtils();

  const mutation = api.subcategory.deleteMany.useMutation({
    onSuccess: async () => {
      await utils.subcategory.getAll.invalidate();
      toast.success("Subcategoria excluída");
    },
  });

  return mutation;
}
