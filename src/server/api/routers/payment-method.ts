import { eq } from "drizzle-orm";
import { paymentMethods } from "~/server/db/schema";
import {
  insertPaymentMethodSchema,
  selectPaymentMethodSchema,
  updatePaymentMethodSchema,
} from "~/server/db/tables/payment-method";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const paymentMethodRouter = createTRPCRouter({
  create: protectedProcedure
    .input(insertPaymentMethodSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(paymentMethods).values(input).returning();
    }),

  update: publicProcedure
    .input(updatePaymentMethodSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(paymentMethods)
        .set(input.data)
        .where(eq(paymentMethods.id, input.id))
        .returning();
    }),

  delete: publicProcedure
    .input(selectPaymentMethodSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(paymentMethods)
        .where(eq(paymentMethods.id, input.id))
        .returning();
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        paymentMethod: paymentMethods,
      })
      .from(paymentMethods);

    return result.map(({ paymentMethod }) => paymentMethod);
  }),

  getById: publicProcedure
    .input(selectPaymentMethodSchema)
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.id, input.id));
      return result[0];
    }),
});
