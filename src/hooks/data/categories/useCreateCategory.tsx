import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface CreateCategoryProps {
  onSuccess?: () => void | Promise<void>;
}

export function useCreateCategory({ onSuccess }: CreateCategoryProps) {
  const { toast } = useToast();
  const utils = api.useUtils();

  const {
    mutate: createCategory,
    isPending: isCreating,
    ...mutation
  } = api.category.create.useMutation({
    onSuccess: async () => {
      await utils.category.getAll.invalidate();

      if (onSuccess) await onSuccess?.();

      toast({
        title: "Categoria criada",
        description: "A categoria foi criada com sucesso.",
      });
    },
  });

  return {
    createCategory,
    isCreating,
    ...mutation,
  };
}
