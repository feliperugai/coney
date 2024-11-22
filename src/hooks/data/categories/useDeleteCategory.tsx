import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

export default function useDeleteCategory() {
  const { toast } = useToast();
  const utils = api.useUtils();

  const mutation = api.category.delete.useMutation({
    onSuccess: async () => {
      await utils.category.getAll.invalidate();
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso.",
      });
    },
  });

  return mutation;
}
