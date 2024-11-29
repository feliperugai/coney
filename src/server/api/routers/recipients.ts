import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { recipients } from "~/server/db/schema";
import {
  createRecipientSchema,
  updateRecipientSchema,
} from "~/server/db/tables/recipients";

export const recipientRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createRecipientSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(recipients)
        .values({
          ...input,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
    }),

  update: protectedProcedure
    .input(updateRecipientSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(recipients)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(recipients.id, input.id))
        .returning();
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(recipients).where(eq(recipients.id, input.id));
    }),

  deleteMany: protectedProcedure
    .input(z.object({ ids: z.array(z.string().uuid()) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(recipients)
        .where(inArray(recipients.id, input.ids))
        .returning();
    }),

  getAll: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(10),
          offset: z.number().min(0).default(0),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { limit = 10, offset = 0 } = input ?? {};
      return ctx.db.query.recipients.findMany({
        limit,
        offset,
        with: {
          category: true,
          subcategory: true,
        },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.recipients.findFirst({
        where: eq(recipients.id, input.id),
        with: {
          category: true,
          subcategory: true,
        },
      });
    }),

  // Buscar recipients por categoria
  getByCategory: protectedProcedure
    .input(
      z.object({
        categoryId: z.string().uuid(),
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { categoryId, limit = 10, offset = 0 } = input;
      return ctx.db.query.recipients.findMany({
        where: eq(recipients.categoryId, categoryId),
        limit,
        offset,
        with: {
          category: true,
          subcategory: true,
        },
      });
    }),
});
