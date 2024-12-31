import { api } from "~/trpc/react";
import { GoalProgressBar } from "./goal-row";
import { format } from "~/lib/currency";

export function GoalsChart() {
  const { data, isLoading } = api.reports.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Nenhum dado encontrado</div>;

  return data.goals.map((goal) => (
    <GoalProgressBar
      key={goal.id}
      id={goal.id}
      label={goal.displayName}
      progress={goal.progress}
      startText={format(goal.totalSpent)} 
      endText={format(goal.amount)}
    />
  ));
}
