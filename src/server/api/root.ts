import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { accountsRouter } from "./routers/accounts";
import { categoryRouter } from "./routers/category";
import { paymentMethodRouter } from "./routers/payment-method";
import { recipientRouter } from "./routers/recipients";
import { subcategoryRouter } from "./routers/subcategory";
import { userRouter } from "./routers/user";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  category: categoryRouter,
  subcategory: subcategoryRouter,
  paymentMethod: paymentMethodRouter,
  accounts: accountsRouter,
  user: userRouter,
  recipient: recipientRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
