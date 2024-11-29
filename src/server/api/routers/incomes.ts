import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { incomes } from "~/server/db/schema";
import { insertIncomeSchema } from "~/server/db/tables/income";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const incomeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(insertIncomeSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(incomes).values(input).returning();
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: insertIncomeSchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(incomes)
        .set(input.data)
        .where(eq(incomes.id, input.id))
        .returning();
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(incomes).where(eq(incomes.id, input.id)).returning();
    }),
  deleteMany: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(incomes)
        .where(inArray(incomes.id, input.ids))
        .returning();
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(incomes);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(incomes)
        .where(eq(incomes.id, input.id));
      return result[0];
    }),
});
