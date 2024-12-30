"use client";

import { CalendarDays, CalendarRange } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { Toggle } from "~/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { format } from "~/lib/currency";
import { getAllDaysInMonth } from "~/lib/date";
import { api } from "~/trpc/react";

const ALL_METHODS = "all";

export default function Component() {
  const [activeChart, setActiveChart] = React.useState(ALL_METHODS);
  const [showAllDays, setShowAllDays] = React.useState(true);
  const { data, isLoading } = api.reports.getAll.useQuery();

  // Agrupa transações por data e opcionalmente inclui todos os dias do mês
  const groupedData = React.useMemo(() => {
    if (!data) return [];

    // Criar um Map com as datas como chaves
    const groupedByDate = data.transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date).toISOString().split("T")[0]!;

      if (!acc.has(date)) {
        acc.set(date, {
          date,
          amounts: {},
          total: 0,
        });
      }

      const entry = acc.get(date)!;
      const methodName = transaction.paymentMethod?.name ?? "default";

      entry.amounts[methodName] =
        (entry.amounts[methodName] ?? 0) + transaction.amount;
      entry.total += transaction.amount;

      return acc;
    }, new Map<string, { date: string; amounts: Record<string, number>; total: number }>());

    if (showAllDays && data.transactions.length > 0) {
      const firstDate = new Date(data.transactions[0]!.date);
      const allDays = getAllDaysInMonth(firstDate);

      allDays.forEach((date) => {
        if (!groupedByDate.has(date)) {
          groupedByDate.set(date, {
            date,
            amounts: data.paymentMethods.reduce(
              (acc, method) => {
                acc[method.name] = 0;
                return acc;
              },
              {} as Record<string, number>,
            ),
            total: 0,
          });
        }
      });
    }

    return Array.from(groupedByDate.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [data, showAllDays]);

  const totals = React.useMemo(() => {
    if (!data) return {};

    const methodTotals = data.transactions.reduce(
      (acc, curr) => {
        const key = curr.paymentMethod?.name ?? "default";
        acc[key] = (acc[key] ?? 0) + curr.amount;
        acc[ALL_METHODS]! += curr.amount;
        return acc;
      },
      { [ALL_METHODS]: 0 } as Record<string, number>,
    );

    return methodTotals;
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Nenhum dado encontrado</div>;

  const chartConfig = {
    ...data.paymentMethods.reduce((acc, method, i) => {
      acc[method.name] = {
        label: method.name,
        color: method.color ?? `hsl(var(--chart-${i + 1}))`,
      };
      return acc;
    }, {} as ChartConfig),
    [ALL_METHODS]: {
      label: "Total",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Despesas variáveis</CardTitle>
              <CardDescription>
                Definidas por método de pagamento
              </CardDescription>
            </div>
            <Toggle
              aria-label="Mostrar todos os dias"
              pressed={showAllDays}
              onPressedChange={setShowAllDays}
              className="ml-4"
            >
              {showAllDays ? (
                <CalendarRange className="h-4 w-4" />
              ) : (
                <CalendarDays className="h-4 w-4" />
              )}
            </Toggle>
          </div>
        </div>
        <div className="flex">
          <button
            data-active={activeChart === ALL_METHODS}
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
            onClick={() => setActiveChart(ALL_METHODS)}
          >
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {format(totals[ALL_METHODS] ?? 0)}
            </span>
          </button>
          {data?.paymentMethods.map(({ image, name }) => (
            <button
              key={name}
              data-active={activeChart === name}
              className="relative z-30 flex flex-1 items-center gap-2 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveChart(name)}
            >
              {image && (
                <div className="size-7 flex-1">
                  <Image
                    src={image}
                    width={28}
                    height={28}
                    className="rounded-md"
                    alt={"Visualização"}
                  />
                </div>
              )}
              <div className="flex flex-col justify-center">
                <span className="text-xs text-muted-foreground">{name}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {format(totals[name] ?? 0)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={groupedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[250px]"
                  nameKey={
                    activeChart === ALL_METHODS
                      ? "total"
                      : `amounts.${activeChart}`
                  }
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            {activeChart === ALL_METHODS
              ? data.paymentMethods.map(({ name }) => (
                  <Bar
                    key={name}
                    dataKey={`amounts.${name}`}
                    name={name}
                    stackId="a"
                    fill={
                      data.paymentMethods.find((m) => m.name === name)?.color ??
                      `hsl(var(--chart-${data.paymentMethods.findIndex((m) => m.name === name) + 1}))`
                    }
                  />
                ))
              : activeChart && (
                  <Bar
                    dataKey={`amounts.${activeChart}`}
                    name={activeChart}
                    stackId="a"
                    fill={
                      data.paymentMethods.find((m) => m.name === activeChart)
                        ?.color ??
                      `hsl(var(--chart-${data.paymentMethods.findIndex((m) => m.name === activeChart) + 1}))`
                    }
                  />
                )}
            {activeChart === ALL_METHODS && (
              <Legend content={<CustomLegend />} />
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Componente customizado para a legenda
const CustomLegend = (props: any) => {
  console.log({ props });
  if (!props) return null;

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-4">
      {props.payload.map((entry: any) => (
        <TooltipProvider key={entry.value}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex cursor-pointer items-center gap-2">
                <div
                  className="size-3 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm">{entry.value}</span>
              </div>
            </TooltipTrigger>
            {entry.payload?.image && (
              <TooltipContent>
                <Image
                  src={entry.payload.image}
                  alt={entry.value}
                  height={16}
                  width={16}
                  className="size-4 rounded-md object-contain"
                />
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};
