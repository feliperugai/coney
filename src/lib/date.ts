export function getStartOfMonth(date?: Date) {
  date = date ?? new Date();
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      1, // Primeiro dia do mês
      0,
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
      23,
      59,
      59,
      999, // Final do dia
    ),
  );
}
