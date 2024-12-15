export function format(value: number | string, locale = "pt-br") {
  const formatter = new Intl.NumberFormat(locale, {
    currency: "BRL",
    currencyDisplay: "symbol",
    currencySign: "standard",
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(parseFloat(value.toString()));
}
