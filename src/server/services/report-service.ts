import { and, gte, lte } from "drizzle-orm";
import { type Database } from "~/server/db";
import { transactions } from "../db/schema";

type ReportFilter = {
  id: string;
  name: string;
  image?: string | null;
  color?: string | null;
};

export class ReportService {
  constructor(private readonly db: Database) {}

  async getAll(start: Date, end: Date) {
    const result = await this.db.query.transactions.findMany({
      columns: { date: true, amount: true },
      with: {
        user: {
          columns: { id: true, name: true, image: true },
        },
        paymentMethod: {
          columns: { id: true, name: true, image: true, color: true },
        },
        category: { columns: { id: true, name: true } },
        subcategory: { columns: { id: true, name: true } },
        recipient: {
          columns: { id: true, name: true, image: true, color: true },
        },
      },
      where: and(gte(transactions.date, start), lte(transactions.date, end)),
      orderBy: (transactions, { asc }) => asc(transactions.date),
    });

    const categories = new Set<string>();
    const subcategories = new Set<string>();
    const recipients = new Set<string>();
    const paymentMethods = new Map<string, ReportFilter>();

    result.forEach((transaction) => {
      if (transaction.category?.name) categories.add(transaction.category.name);
      if (transaction.recipient?.name)
        recipients.add(transaction.recipient.name);

      if (transaction.subcategory?.name) {
        subcategories.add(transaction.subcategory.name);
      }

      if (transaction.paymentMethod?.name) {
        paymentMethods.set(
          transaction.paymentMethod.id,
          transaction.paymentMethod,
        );
      }
    });

    return {
      transactions: result.map((transaction) => ({
        ...transaction,
        amount: parseFloat(transaction.amount),
      })),
      categories: Array.from(categories),
      subcategories: Array.from(subcategories),
      recipients: Array.from(recipients),
      paymentMethods: Array.from(paymentMethods.values()),
    };
  }
}
