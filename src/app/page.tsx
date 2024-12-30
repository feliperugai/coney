"use client";

import * as React from "react";
import ExpensesByCategory from "~/components/charts/categories-pie";
import TransactionsByDate from "~/components/charts/transactions-bar";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <TransactionsByDate className="col-span-3"/>
      <ExpensesByCategory className=""/>
    </div>
  );
}
