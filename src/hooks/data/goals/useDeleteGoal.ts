import { toast } from "sonner";
import { api } from "~/trpc/react";

export default function useDeleteGoal() {
  const utils = api.useUtils();

  const mutation = api.goal.deleteMany.useMutation({
    onSuccess: async () => {
      await utils.goal.getAll.invalidate();
      toast.success("Meta excluída 😭");
    },
  });

  return mutation;
}
