import { CardHeader, CardTitle } from "~/components/ui/card";
import { format } from "~/lib/currency";
import { api } from "~/trpc/react";
import { GoalProgressBar } from "./goal-row";

export function GoalsChart() {
  const { data, isLoading } = api.reports.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Nenhum dado encontrado</div>;

  const totals = data.goals.reduce(
    (sum, goal) => {
      return {
        total: sum.total + parseFloat(goal.amount),
        spent: sum.spent + goal.totalSpent,
      };
    },
    {
      total: 0,
      spent: 0,
    },
  );

  return (
    <>
      <CardHeader className="px-0">
        <CardTitle className="flex items-center justify-between gap-2">
          <div>Metas</div>
          <span className="text-sm font-bold leading-none transition-all @[400px]:text-base @[600px]:text-lg @[886px]:text-xl @[950px]:text-2xl">
            {format(totals.spent)}/{format(totals.total)}
            <span className="text-sm ml-2 font-normal text-gray-400">
              {" "}
              ({((totals.spent / totals.total) * 100).toFixed(1)}%)
            </span>
          </span>
        </CardTitle>
      </CardHeader>
      {data.goals.map((goal) => (
        <GoalProgressBar
          key={goal.id}
          id={goal.id}
          label={goal.displayName}
          progress={goal.progress}
          startText={format(goal.totalSpent)}
          endText={format(goal.amount)}
        />
      ))}
    </>
  );
}
