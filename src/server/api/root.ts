import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { accountsRouter } from "./routers/accounts";
import { categoryRouter } from "./routers/category";
import { incomeRouter } from "./routers/incomes";
import { installmentPurchaseRouter } from "./routers/installment-purchases";
import { paymentMethodRouter } from "./routers/payment-method";
import { recipientRouter } from "./routers/recipients";
import { subcategoryRouter } from "./routers/subcategory";
import { transactionRouter } from "./routers/transactions";
import { userRouter } from "./routers/user";
import { goalsRouter } from "./routers/goal";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  goal: goalsRouter,
  installmentPurchases: installmentPurchaseRouter,
  category: categoryRouter,
  subcategory: subcategoryRouter,
  paymentMethod: paymentMethodRouter,
  accounts: accountsRouter,
  user: userRouter,
  recipient: recipientRouter,
  income: incomeRouter,
  transaction: transactionRouter,
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
