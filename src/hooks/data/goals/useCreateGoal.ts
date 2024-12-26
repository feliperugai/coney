import { toast } from "sonner";
import { api } from "~/trpc/react";

interface CreateGoalProps {
  onSuccess?: () => void | Promise<void>;
}

export function useCreateGoal({ onSuccess }: CreateGoalProps) {
  const utils = api.useUtils();

  const {
    mutate: createGoal,
    isPending: isCreating,
    ...mutation
  } = api.goal.create.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: async () => {
      await utils.goal.getAll.invalidate();

      if (onSuccess) await onSuccess?.();
      toast.success("Nova meta adicionada! Você consegue!");
    },
  });

  return {
    createGoal,
    isCreating,
    ...mutation,
  };
}
