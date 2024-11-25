/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateSubcategory } from "~/hooks/data/subcategories/useCreateSubcategory";
import { useUpdateSubcategory } from "~/hooks/data/subcategories/useUpdateSubcategory";

const subcategorySchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
    .max(50, { message: "O nome deve ter no máximo 50 caracteres" }),
  color: z.string(),
  categoryId: z.string(),
});

export type SubcategoryForm = z.infer<typeof subcategorySchema>;

export function useSubcategoryForm(
  closeModal: () => void,
  initialData?: { id: string } & SubcategoryForm,
) {
  const { createSubcategory, isCreating } = useCreateSubcategory({
    onSuccess: closeModal,
  });

  const { updateSubcategory, isUpdating } = useUpdateSubcategory({
    onSuccess: closeModal,
  });

  const isLoading = isCreating || isUpdating;

  function onSubmit(data: SubcategoryForm) {
    if (initialData) {
      updateSubcategory({
        id: initialData.id,
        data,
      });
    } else {
      createSubcategory(data);
    }
  }

  const form = useForm<SubcategoryForm>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: initialData ?? {
      name: "",
      color: "#000000",
      categoryId: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        name: "",
        color: "#000000",
        categoryId: "",
      });
    }
  }, [initialData]);

  return { onSubmit, form, isLoading };
}
