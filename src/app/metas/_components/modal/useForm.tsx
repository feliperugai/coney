/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateGoal } from "~/hooks/data/goals/useCreateGoal";
import { useUpdateGoal } from "~/hooks/data/goals/useUpdateGoal";
import { currency } from "~/lib/zod";

const goalFormSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  amount: currency(),
  categoryId: z.string().uuid().optional().nullable(),
  subcategoryId: z.string().uuid().optional().nullable(),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;

function getDate(date?: string | Date): any {
  date = date ?? new Date();
  return new Date(date).toISOString().split("T")[0];
}

export function useGoalForm(
  closeModal: () => void,
  initialData?: { id: string } & GoalFormValues,
) {
  const { createGoal, isCreating } = useCreateGoal({
    onSuccess: closeModal,
  });

  const { updateGoal, isUpdating } = useUpdateGoal({
    onSuccess: closeModal,
  });

  const isLoading = isCreating || isUpdating;

  async function onSubmit(data: GoalFormValues) {
    if (initialData) {
      updateGoal({ id: initialData.id, data });
    } else {
      createGoal(data);
    }
  }

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: initialData ?? {
      startDate: getDate(),
      endDate: getDate(),
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        startDate: getDate(initialData.startDate),
        endDate: getDate(initialData.endDate),
      });
    } else {
      form.reset({
        startDate: getDate(),
        endDate: getDate(),
      });
    }
  }, [initialData]);

  return { onSubmit, form, isLoading };
}
