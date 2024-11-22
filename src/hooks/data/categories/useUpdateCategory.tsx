import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface UpdateCategoryProps {
  onSuccess?: () => void | Promise<void>;
}

export function useUpdateCategory({ onSuccess }: UpdateCategoryProps) {
  const { toast } = useToast();
  const utils = api.useUtils();

  const {
    mutate: updateCategory,
    isPending: isUpdating,
    ...mutation
  } = api.category.update.useMutation({
    onSuccess: async () => {
      await utils.category.getAll.invalidate();

      if (onSuccess) await onSuccess?.();

      toast({
        title: "Categoria atualizada",
        description: "A categoria foi atualizada com sucesso.",
      });
    },
  });

  return {
    updateCategory,
    isUpdating,
    ...mutation,
  };
}
