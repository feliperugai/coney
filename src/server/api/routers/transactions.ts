import { endOfMonth, startOfMonth } from "date-fns";
import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { z } from "zod";
import {
  categories,
  recipients,
  subcategories,
  transactions,
} from "~/server/db/schema";
import { insertTransactionSchema } from "~/server/db/tables/transactions";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
      const now = new Date();
      const start = input?.startDate ?? startOfMonth(now);
      const end = input?.endDate ?? endOfMonth(now);

      return ctx.db
        .select({
          id: transactions.id,
          date: transactions.date,
          description: transactions.description,
          amount: transactions.amount,
          category: {
            id: categories.id,
            name: categories.name,
          },
          subcategory: {
            id: subcategories.id,
            name: subcategories.name,
          },
          recipient: {
            id: recipients.id,
            name: recipients.name,
          },
          createdAt: transactions.createdAt,
          updatedAt: transactions.updatedAt,
        })
        .from(transactions)
        .innerJoin(categories, eq(transactions.categoryId, categories.id))
        .innerJoin(
          subcategories,
          eq(transactions.subcategoryId, subcategories.id),
        )
        .innerJoin(recipients, eq(transactions.recipientId, recipients.id))
        .where(and(gte(transactions.date, start), lte(transactions.date, end)));
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
