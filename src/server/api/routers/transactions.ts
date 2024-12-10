import { z } from "zod";
import { insertTransactionSchema } from "~/server/db/tables/transactions";
import { TransactionService } from "../services/transaction-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export type Transactions = Awaited<
  ReturnType<typeof TransactionService.prototype.getAll>
>;

export const transactionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(insertTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new TransactionService(ctx.db);
      return service.create(input);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: insertTransactionSchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new TransactionService(ctx.db);
      return service.update(input.id, input.data);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new TransactionService(ctx.db);
      return service.delete(input.id);
    }),

  deleteMany: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new TransactionService(ctx.db);
      return service.deleteMany(input.ids);
    }),

  getAll: protectedProcedure
    .input(
      z
        .object({
          startDate: z.string().date().optional(),
          endDate: z.string().date().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const service = new TransactionService(ctx.db);
      return service.getAll(input);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new TransactionService(ctx.db);
      return service.getById(input.id);
    }),
});
