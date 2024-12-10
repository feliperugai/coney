import { pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `coney_${name}`);

import { accounts, accountsRelations } from "./tables/accounts";
import { categories } from "./tables/categories";
import { incomes } from "./tables/income";
import { installmentRelations, installments } from "./tables/installments";
import { paymentMethods } from "./tables/payment-method";
import { recipientRelations, recipients } from "./tables/recipients";
import { sessions, sessionsRelations } from "./tables/session";
import { subcategories, subcategoriesRelations } from "./tables/subcategories";
import { transactionRelations, transactions } from "./tables/transactions";
import { users, usersRelations } from "./tables/users";
import { verificationTokens } from "./tables/verificationTokens";

export {
  accounts,
  accountsRelations,
  categories,
  incomes,
  installmentRelations,
  installments,
  paymentMethods,
  recipientRelations,
  recipients,
  sessions,
  sessionsRelations,
  subcategories,
  subcategoriesRelations,
  transactionRelations,
  transactions,
  users,
  usersRelations,
  verificationTokens,
};
