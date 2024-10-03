// formatters.ts
import { FormatterOptions } from "@/types/supabase";

export type FormatterFunction = (value: any) => string | React.ReactNode;

export const getFormatter = (
  formatterOptions?: FormatterOptions
): FormatterFunction => {
  const formatterType = formatterOptions?.customFormatter;
  const dateFormat = formatterOptions?.dateFormat;

  switch (formatterType) {
    case "shortDate":
      return (value) => new Date(value).toLocaleDateString();
    case "date":
      return (value) => new Date(value).toLocaleString();
    case "number":
      return (value) => new Intl.NumberFormat("en-US").format(value);
    case "shortNumber":
      return (value) => {
        const absValue = Math.abs(value);
        if (absValue >= 1e12) return (value / 1e12).toFixed(1) + "T";
        if (absValue >= 1e9) return (value / 1e9).toFixed(1) + "B";
        if (absValue >= 1e6) return (value / 1e6).toFixed(1) + "M";
        if (absValue >= 1e3) return (value / 1e3).toFixed(1) + "K";
        return value.toString();
      };
    case "fixedNumber":
      return (value) => value.toFixed(2);
    case "percent":
      return (value) =>
        new Intl.NumberFormat("en-US", { style: "percent" }).format(value);
    case "currency":
      return (value) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
    case "posNeg":
      const PosNegFormatter = (value: any) => (
        <span
          className={
            value > 0
              ? "text-green-primary dark:text-green-primary-dark"
              : value < 0
              ? "text-accent-red"
              : ""
          }
        >
          {value}
        </span>
      );
      PosNegFormatter.displayName = "PosNegFormatter";
      return PosNegFormatter;
    case "email":
      const EmailFormatter = (value: any) => (
        <a
          href={`mailto:${value}`}
          className="text-accent-blue hover:underline"
        >
          {value}
        </a>
      );
      EmailFormatter.displayName = "EmailFormatter";
      return EmailFormatter;
    default:
      return (value) => (value != null ? value.toString() : "");
  }
};
