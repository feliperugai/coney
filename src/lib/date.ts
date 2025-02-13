export function getStartOfMonth(date?: Date) {
  date = date ?? new Date();
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      1, // Primeiro dia do mês
      16,
      0,
      0,
      1, // Zerando horas, minutos, segundos e milissegundos
    ),
  );
}

export function getEndOfMonth(date?: Date) {
  date = date ?? new Date();

  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1, // Próximo mês
      0, // Dia 0 retorna o último dia do mês anterior
      16,
      0,
      0,
      0, // Final do dia
    ),
  );
}

export function getAllDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: days }, (_, i) => {
    const day = new Date(year, month, i + 1);
    return day.toISOString().split("T")[0]!;
  });
}
