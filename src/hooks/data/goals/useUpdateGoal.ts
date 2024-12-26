import { toast } from "sonner";
import { api } from "~/trpc/react";

interface UpdateGoalProps {
  onSuccess?: () => void | Promise<void>;
}

export function useUpdateGoal({ onSuccess }: UpdateGoalProps) {
  const utils = api.useUtils();

  const {
    mutate: updateGoal,
    isPending: isUpdating,
    ...mutation
  } = api.goal.update.useMutation({
    onSuccess: async () => {
      await utils.goal.getAll.invalidate();

      if (onSuccess) await onSuccess?.();
      toast.success("Meta atualizada 😎");
    },
  });

  return {
    updateGoal,
    isUpdating,
    ...mutation,
  };
}
