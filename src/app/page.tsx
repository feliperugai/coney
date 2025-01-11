"use client";

import ExpensesByCategory from "~/components/charts/categories-pie";
import TransactionsByDate from "~/components/charts/transactions-bar";

export default function DashboardPage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid-cols-4 grid w-full gap-4">
        <TransactionsByDate className="col-span-3" />
        <ExpensesByCategory className="" />
      </div>
    </div>
  );
}
