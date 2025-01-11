import { and, gte, lte } from "drizzle-orm";
import { type Database } from "~/server/db";
import { transactions } from "../db/schema";
import { goals, type Goal } from "../db/tables/goals";

export class ReportService {
  constructor(private readonly db: Database) {}

  async getAll(start: Date, end: Date) {
    const data = await this.db.query.transactions.findMany({
      columns: { date: true, amount: true },
      with: {
        user: {
          columns: { id: true, name: true, image: true },
        },
        paymentMethod: {
          columns: { id: true, name: true, image: true, color: true },
        },
        category: { columns: { id: true, name: true, color: true } },
        subcategory: { columns: { id: true, name: true, color: true } },
        recipient: {
          columns: { id: true, name: true, image: true, color: true },
        },
      },
      where: and(gte(transactions.date, start), lte(transactions.date, end)),
      orderBy: (transactions, { asc }) => asc(transactions.date),
    });

    const result = this.mapResults(data);

    const goalsWithProgress = await this.calculateGoals(
      result.transactions,
      start,
      end,
    );

    return { ...result, goals: goalsWithProgress };
  }

  mapResults(result: ReportSqlDto[]) {
    const categories = new Map<
      string,
      ReportFilter & { subcategories: ReportFilter[] }
    >();
    const subcategories = new Set<string>();
    const recipients = new Set<string>();
    const paymentMethods = new Map<string, ReportFilter>();
    const transactions: ReportSqlResult[] = [];

    for (const item of result) {
      transactions.push({
        ...item,
        amount: parseFloat(item.amount),
      });
      if (item.category?.name) {
        categories.set(item.category.name, {
          ...item.category,
          subcategories: [],
        });
      }

      if (item.recipient?.name) {
        recipients.add(item.recipient.name);
      }

      if (item.subcategory?.name) {
        subcategories.add(item.subcategory.name);
        categories.get(item.category!.name)?.subcategories.push({
          ...item.subcategory,
        });
      }

      if (item.paymentMethod?.name) {
        paymentMethods.set(item.paymentMethod.id, item.paymentMethod);
      }
    }

    return {
      transactions: result.map((transaction) => ({
        ...transaction,
        amount: parseFloat(transaction.amount),
      })),
      categories: Array.from(categories.values()),
      subcategories: Array.from(subcategories),
      recipients: Array.from(recipients),
      paymentMethods: Array.from(paymentMethods.values()),
    };
  }

  async calculateGoals(
    transactions: ReportSqlResult[],
    start: Date,
    end: Date,
  ) {
    const data = await this.db.query.goals.findMany({
      with: {
        category: { columns: { id: true, name: true } },
        subcategory: { columns: { id: true, name: true } },
      },
      where: and(gte(goals.startDate, start), lte(goals.endDate, end)),
    });

    return data.map((goal) => {
      const relevantTransactions = transactions.filter((transaction) => {
        const matchesCategory =
          goal.categoryId && transaction.category?.id === goal.categoryId;

        const matchesSubcategory =
          goal.subcategoryId &&
          transaction.subcategory?.id === goal.subcategoryId;

        const isWithinDateRange =
          transaction.date >= goal.startDate &&
          transaction.date <= goal.endDate;

        return (matchesCategory ?? matchesSubcategory) && isWithinDateRange;
      });

      const totalSpent = relevantTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0,
      );

      const progress = (totalSpent / parseFloat(goal.amount)) * 100;

      return {
        ...goal,
        displayName: goal.category?.name ?? goal.subcategory?.name ?? "?",
        totalSpent,
        progress,
        reached: progress >= 100,
      };
    });
  }
}

type ReportFilter = {
  id: string;
  name: string;
  image?: string | null;
  color?: string | null;
};

type ReportSqlDto = {
  date: Date;
  amount: string;
  paymentMethod?: ReportFilter | null;
  category?: ReportFilter | null;
  subcategory?: ReportFilter | null;
  recipient?: ReportFilter | null;
};

type ReportSqlResult = Omit<ReportSqlDto, "amount"> & {
  amount: number;
};
