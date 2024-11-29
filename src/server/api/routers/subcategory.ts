import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
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

  deleteMany: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(subcategories)
        .where(inArray(subcategories.id, input.ids))
        .returning();
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        subcategory: subcategories,
        category: categories,
      })
      .from(subcategories)
      .leftJoin(categories, eq(subcategories.categoryId, categories.id));

    return result.map(({ subcategory, category }) => ({
      ...subcategory,
      category,
    }));
  }),

  getByCategoryId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(subcategories)
        .where(eq(subcategories.categoryId, input));
      return result;
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
