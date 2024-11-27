import { eq } from "drizzle-orm";
import { z } from "zod";
import { categories } from "~/server/db/schema";
import { insertCategorySchema } from "~/server/db/tables/categories";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(insertCategorySchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(categories).values(input).returning();
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: insertCategorySchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(categories)
        .set(input.data)
        .where(eq(categories.id, input.id))
        .returning();
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(categories)
        .where(eq(categories.id, input.id))
        .returning();
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(categories);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.id, input.id));
      return result[0];
    }),
});
