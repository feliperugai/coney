import { endOfDay, endOfMonth, startOfDay, startOfMonth } from "date-fns";
import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { z } from "zod";
import { transactions } from "~/server/db/schema";
import { insertTransactionSchema } from "~/server/db/tables/transactions";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getStartOfMonth, getEndOfMonth } from "~/lib/date";

export const transactionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(insertTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(transactions).values(input).returning();
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: insertTransactionSchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(transactions)
        .set(input.data)
        .where(eq(transactions.id, input.id))
        .returning();
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(transactions).where(eq(transactions.id, input.id));
    }),

  deleteMany: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(transactions)
        .where(inArray(transactions.id, input.ids))
        .returning();
    }),

  getAll: protectedProcedure
    .input(
      z
        .object({
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const start = input?.startDate ?? getStartOfMonth();
      const end = input?.endDate ?? getEndOfMonth();

      return ctx.db.query.transactions.findMany({
        with: {
          category: { columns: { id: true, name: true } },
          subcategory: { columns: { id: true, name: true } },
          recipient: { columns: { id: true, name: true } },
        },
        where: and(gte(transactions.date, start), lte(transactions.date, end)),
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(transactions)
        .where(eq(transactions.id, input.id));
      return result[0];
    }),
});
