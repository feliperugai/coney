import { z } from "zod";
import { insertSchema } from "~/server/db/tables/installmentsPurchases";
import { InstallmentPurchaseService } from "../services/installment-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export type InstallmentPurchases = Awaited<
  ReturnType<typeof InstallmentPurchaseService.prototype.getAll>
>;

export const installmentPurchaseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(insertSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new InstallmentPurchaseService(ctx.db);
      return service.create(input);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: insertSchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new InstallmentPurchaseService(ctx.db);
      return service.update(input.id, input.data);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new InstallmentPurchaseService(ctx.db);
      return service.delete(input.id);
    }),

  deleteMany: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new InstallmentPurchaseService(ctx.db);
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
      const service = new InstallmentPurchaseService(ctx.db);
      return service.getAll(input);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new InstallmentPurchaseService(ctx.db);
      return service.getById(input.id);
    }),
});
