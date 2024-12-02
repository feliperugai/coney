import { pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `coney_${name}`);

export { accounts, accountsRelations } from "./tables/accounts";
export { categories } from "./tables/categories";
export { incomes } from "./tables/income";
export { paymentMethods } from "./tables/payment-method";
export { recipientRelations, recipients } from "./tables/recipients";
export { sessions, sessionsRelations } from "./tables/session";
export { subcategories, subcategoriesRelations } from "./tables/subcategories";
export { transactionRelations, transactions } from "./tables/transactions";
export { users, usersRelations } from "./tables/users";
export { verificationTokens } from "./tables/verificationTokens";
