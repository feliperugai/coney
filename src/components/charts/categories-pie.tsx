import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { format } from "~/lib/currency";
import { api } from "~/trpc/react";

export function ExpensesByCategory({ className }: { className?: string }) {
  const { data, isLoading } = api.reports.getAll.useQuery();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const categoryData = React.useMemo(() => {
    if (!data?.transactions) return [];

    // Agrupa transações por categoria e subcategoria
    const groupedByCategory = data.transactions.reduce<
      Record<string, CategoryData>
    >((acc, transaction) => {
      const categoryName = transaction.category?.name ?? "Sem categoria";
      const subcategoryName = transaction.subcategory?.name;

      if (!acc[categoryName]) {
        acc[categoryName] = {
          id: transaction.category?.id,
          color: transaction.category?.color,
          name: categoryName,
          value: 0,
          subcategories: {},
        };
      }

      acc[categoryName].value += transaction.amount;

      if (subcategoryName && transaction.subcategory?.id) {
        if (!acc[categoryName].subcategories[subcategoryName]) {
          acc[categoryName].subcategories[subcategoryName] = {
            id: transaction.subcategory.id,
            color: transaction.subcategory.color,
            name: subcategoryName,
            value: 0,
          };
        }
        acc[categoryName].subcategories[subcategoryName].value +=
          transaction.amount;
      }

      return acc;
    }, {});

    return Object.values(groupedByCategory).sort((a, b) => b.value - a.value);
  }, [data]);

  const currentData = React.useMemo(() => {
    if (!selectedCategory) return categoryData;

    const category = categoryData.find((c) => c.id === selectedCategory);
    if (!category) return categoryData;

    return Object.values(category.subcategories)
      .sort((a, b) => b.value - a.value)
      .map((sub) => ({
        ...sub,
        parentValue: category.value,
      }));
  }, [categoryData, selectedCategory]);

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
  ] as const;

  const handleClick = (data: ChartData) => {
    if (isAnimating || !data.id) return;

    setIsAnimating(true);
    const category = categoryData.find((c) => c.id === data.id);

    if (category && Object.keys(category.subcategories).length > 0) {
      setSelectedCategory(data.id);
    }

    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleBack = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelectedCategory(null);
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Nenhum dado encontrado</div>;

  const total = selectedCategory
    ? (categoryData.find((c) => c.id === selectedCategory)?.value ?? 0)
    : categoryData.reduce((sum, category) => sum + category.value, 0);

  const selectedCategoryName = selectedCategory
    ? categoryData.find((c) => c.id === selectedCategory)?.name
    : null;

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    value,
    name,
  }: PieChartLabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percent = ((value / total) * 100).toFixed(1);

    if (parseFloat(percent) < 5) return null;

    return (
      <text
        x={x}
        y={y}
        className="fill-current text-xs"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${name} (${percent}%)`}
      </text>
    );
  };

  const renderTooltipContent = ({ active, payload }: TooltipProps) => {
    if (!active || !payload?.length || !payload[0]?.payload) return null;

    const data = payload[0].payload;
    const index = categoryData.findIndex((c) => c.id === data.id);

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="flex items-center gap-2 font-medium">
          <div
            className="size-4 rounded-md border"
            style={{
              backgroundColor: data.color ?? COLORS[index % COLORS.length],
            }}
          ></div>
          {data.name}
        </div>
        <p className="text-sm text-muted-foreground">
          {format(data.value)} ({((data.value / total) * 100).toFixed(1)}%)
        </p>
        {!selectedCategory &&
          data.id &&
          Object.keys(
            categoryData.find((c) => c.id === data.id)?.subcategories ?? {},
          ).length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              Clique para ver subcategorias
            </p>
          )}
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-4">
          {selectedCategory && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              disabled={isAnimating}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <CardTitle>
              {selectedCategory
                ? `${selectedCategoryName} - Subcategorias`
                : "Despesas por Categoria"}
            </CardTitle>
            <CardDescription>Total: {format(total)}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={currentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                labelLine={false}
                onClick={handleClick}
                animationDuration={500}
                label={renderCustomLabel}
              >
                {currentData.map((entry, index) => (
                  <Cell
                    key={entry.id ?? entry.name}
                    fill={entry.color ?? COLORS[index % COLORS.length]}
                    className="stroke-background hover:opacity-90"
                    strokeWidth={2}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </Pie>
              <Tooltip content={renderTooltipContent as any} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {currentData.map((category, index) => (
            <div
              key={category.id ?? category.name}
              className="flex cursor-pointer items-center gap-2"
              onClick={() => handleClick(category)}
            >
              <div
                className="h-3 w-3 rounded-sm"
                style={{
                  backgroundColor:
                    category.color ?? COLORS[index % COLORS.length],
                }}
              />
              <span className="text-sm">
                {category.name} ({((category.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ExpensesByCategory;

interface CategoryData {
  id?: string;
  name: string;
  value: number;
  color?: string | null;
  subcategories: Record<string, SubcategoryData>;
}

interface SubcategoryData {
  id?: string;
  color?: string | null;
  name: string;
  value: number;
  parentValue?: number;
}

interface ChartData {
  id?: string;
  color?: string | null;
  name: string;
  value: number;
  parentValue?: number;
}

interface PieChartLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  value: number;
  name: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
  }>;
}
