import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  updateName: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(users)
        .set({ name: input.name })
        .where(eq(users.id, ctx.session.user.id))
        .returning();

      return result[0];
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.select().from(users);
    return result;
  }),
});
