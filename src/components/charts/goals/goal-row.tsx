import Link from "next/link";
import { Progress } from "~/components/ui/progress";

interface GoalProgressBarProps {
  id: string;
  label: string;
  progress: number; // Percentual de progresso
  startText?: string;
  endText?: string;
}
const getColor = (progress: number) => {
  if (progress <= 25) return "bg-green-500"; // Verde claro
  if (progress <= 50) return "bg-green-400"; // Verde médio
  if (progress <= 75) return "bg-yellow-400"; // Amarelo esverdeado
  if (progress <= 100) return "bg-yellow-500"; // Amarelo
  if (progress <= 125) return "bg-red-400 animate-pulse"; // Vermelho claro
  return "bg-red-600 animate-pulse"; // Vermelho intenso
};

export const GoalProgressBar: React.FC<GoalProgressBarProps> = ({
  id,
  label,
  progress,
  startText,
  endText,
}) => {
  return (
    <Link href="/metas" as={`/metas?id=${id}`}>
      <div className="space-y-2 rounded-lg border border-border/50 p-2 shadow-sm transition-all hover:bg-sidebar-accent mb-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
        </div>
        <Progress
          value={Math.min(progress, 150)}
          indicatorClassName={getColor(progress)}
          startText={startText}
          endText={endText}
        />
      </div>
    </Link>
  );
};
