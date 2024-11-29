import { toast } from "sonner";
import { api } from "~/trpc/react";

export default function useDeleteRecipient() {
  const utils = api.useUtils();

  const mutation = api.recipient.deleteMany.useMutation({
    onSuccess: async () => {
      await utils.recipient.getAll.invalidate();
      toast.success("Subcategoria excluída");
    },
  });

  return mutation;
}
