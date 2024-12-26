import { pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `coney_${name}`);

import { accounts, accountsRelations } from "./tables/accounts";
import { categories } from "./tables/categories";
import { goalRelations, goals } from "./tables/goals";
import { incomes } from "./tables/income";
import {
  installmentPurchases,
  installmentRelations,
} from "./tables/installmentsPurchases";
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
  goalRelations,
  goals,
  incomes,
  installmentPurchases,
  installmentRelations,
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
