/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateCategory } from "~/hooks/data/categories/useCreateCategory";
import { useUpdateCategory } from "~/hooks/data/categories/useUpdateCategory";

const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
    .max(50, { message: "O nome deve ter no máximo 50 caracteres" }),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export function useCategoryForm(
  closeModal: () => void,
  initialData?: { id: string } & CategoryFormValues,
) {
  const { createCategory, isCreating } = useCreateCategory({
    onSuccess: closeModal,
  });

  const { updateCategory, isUpdating } = useUpdateCategory({
    onSuccess: closeModal,
  });

  const isLoading = isCreating || isUpdating;

  function onSubmit(data: CategoryFormValues) {
    if (initialData) {
      updateCategory({
        id: initialData.id,
        data,
      });
    } else {
      createCategory(data);
    }
  }

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData ?? {
      name: "",
      color: "#000000",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        name: "",
        color: "#000000",
      });
    }
  }, [initialData]);

  return { onSubmit, form, isLoading };
}
