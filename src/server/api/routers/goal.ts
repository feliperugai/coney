import { z } from "zod";
import { GoalService } from "~/server/services/goal-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export type Goals = Awaited<ReturnType<typeof GoalService.prototype.getAll>>;

export const createGoalSchema = z
  .object({
    categoryId: z.string().uuid().optional().nullable(),
    subcategoryId: z.string().uuid().optional().nullable(),
    startDate: z.date(),
    endDate: z.date(),
    amount: z
      .number()
      .positive()
      .transform((value) => value.toString()),
  })
  .refine((data) => data.categoryId ?? data.subcategoryId, {
    message: "É necessário informar uma categoria ou subcategoria",
  })
  .refine((data) => !(data.categoryId && data.subcategoryId), {
    message: "Não é possível informar categoria e subcategoria simultaneamente",
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "A data final deve ser maior que a data inicial",
  });

export const goalsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createGoalSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new GoalService(ctx.db);
      return service.create({
        ...input,
        userId: ctx.session.user.id,
      });
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
      const service = new GoalService(ctx.db);
      return service.getAll(input);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const service = new GoalService(ctx.db);
      return service.delete(input.id, ctx.session.user.id);
    }),
  deleteMany: protectedProcedure
    .input(z.object({ ids: z.array(z.string().uuid()) }))
    .mutation(async ({ ctx, input }) => {
      const service = new GoalService(ctx.db);
      return service.deleteMany(input.ids, ctx.session.user.id);
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: createGoalSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const service = new GoalService(ctx.db);
      return service.update(input.id, ctx.session.user.id, input.data);
    }),
});
