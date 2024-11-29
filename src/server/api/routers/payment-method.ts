import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { paymentMethods } from "~/server/db/schema";
import {
  insertPaymentMethodSchema,
  selectPaymentMethodSchema,
  updatePaymentMethodSchema,
} from "~/server/db/tables/payment-method";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const paymentMethodRouter = createTRPCRouter({
  create: protectedProcedure
    .input(insertPaymentMethodSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(paymentMethods).values(input).returning();
    }),

  update: protectedProcedure
    .input(updatePaymentMethodSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(paymentMethods)
        .set(input.data)
        .where(eq(paymentMethods.id, input.id))
        .returning();
    }),

  delete: protectedProcedure
    .input(selectPaymentMethodSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(paymentMethods)
        .where(eq(paymentMethods.id, input.id))
        .returning();
    }),

  deleteMany: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(paymentMethods)
        .where(inArray(paymentMethods.id, input.ids))
        .returning();
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        paymentMethod: paymentMethods,
      })
      .from(paymentMethods);

    return result.map(({ paymentMethod }) => paymentMethod);
  }),

  getById: protectedProcedure
    .input(selectPaymentMethodSchema)
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.id, input.id));
      return result[0];
    }),
});
