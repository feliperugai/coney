import { accounts } from "~/server/db/schema";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const accountsRouter = createTRPCRouter({
  getUserAccounts: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(accounts)
        .where(eq(accounts.userId, input));
      return result;
    }),
});
