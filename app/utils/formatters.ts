import { FormatterOptions } from "@/types/column";
//TODO: use formatter in the Preview component to format the data, refine the formatter function
export const formatValue = (
  value: any,
  formatterOptions?: FormatterOptions
): string => {
  if (!formatterOptions) return String(value);

  const { regexPattern, numberFormat, dateFormat, customFormatter } =
    formatterOptions;

  if (regexPattern) {
    const regex = new RegExp(regexPattern);
    return regex.test(value) ? value : "Invalid";
  }

  if (numberFormat) {
    const formatter = new Intl.NumberFormat(undefined, numberFormat);
    return formatter.format(Number(value));
  }

  if (dateFormat) {
    const date = new Date(value);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  if (customFormatter) {
    switch (customFormatter) {
      case "shortDate":
        return new Date(value).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      case "date":
        return new Date(value).toLocaleString();
      case "number":
        return Number(value).toString();
      case "shortNumber":
        return Number(value).toLocaleString(undefined, { notation: "compact" });
      case "fixedNumber":
        return Number(value).toFixed(2);
      case "percent":
        return `${Number(value).toFixed(2)}%`;
      case "currency":
        return new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: "USD",
        }).format(Number(value));
      default:
        return String(value);
    }
  }

  return String(value);
};
