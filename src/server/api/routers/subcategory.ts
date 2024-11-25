import { eq } from "drizzle-orm";
import { categories, subcategories } from "~/server/db/schema";
import {
  insertSubcategorySchema,
  selectSubcategorySchema,
  updateSubcategorySchema,
} from "~/server/db/tables/subcategories";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const subcategoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(insertSubcategorySchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(subcategories).values(input).returning();
    }),

  update: publicProcedure
    .input(updateSubcategorySchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(subcategories)
        .set(input.data)
        .where(eq(subcategories.id, input.id))
        .returning();
    }),

  delete: publicProcedure
    .input(selectSubcategorySchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(subcategories)
        .where(eq(subcategories.id, input.id))
        .returning();
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        subcategory: subcategories,
        category: categories, // Define os campos que deseja retornar
      })
      .from(subcategories)
      .leftJoin(categories, eq(subcategories.categoryId, categories.id)); // Faz a junção com categorias

    // O resultado pode vir em um formato de array de objetos, você pode ajustar conforme necessário

    return result.map(({ subcategory, category }) => ({
      ...subcategory,
      category,
    }));
  }),

  getById: publicProcedure
    .input(selectSubcategorySchema)
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(subcategories)
        .where(eq(subcategories.id, input.id));
      return result[0];
    }),
});
