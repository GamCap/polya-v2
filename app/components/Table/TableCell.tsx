import React from "react";
import { Column } from "@/types/supabase";

interface TableCellProps {
  item: any;
  column: Column;
}

export const TableCell: React.FC<TableCellProps> = ({ item, column }) => {
  const value = item[column.id];
  //TODO: Refine the formatters
  if (column.formatterOptions)
    if (column.formatterOptions.dateFormat) {
      return <td className="p-2">{new Date(value).toLocaleDateString()}</td>;
    } else if (column.formatterOptions.customFormatter) {
      switch (column.formatterOptions.customFormatter) {
        case "shortDate":
          return (
            <td className="p-2">{new Date(value).toLocaleDateString()}</td>
          );
        case "date":
          return (
            <td className="p-2">{new Date(value).toLocaleDateString()}</td>
          );
        case "number":
          return (
            <td className="p-2">
              {new Intl.NumberFormat("en-US").format(value)}
            </td>
          );
        case "shortNumber":
          return (
            <td className="p-2">
              {new Intl.NumberFormat("en-US").format(value)}
            </td>
          );
        case "fixedNumber":
          return (
            <td className="p-2">
              {new Intl.NumberFormat("en-US").format(value)}
            </td>
          );
        case "percent":
          return (
            <td className="p-2">
              {new Intl.NumberFormat("en-US", { style: "percent" }).format(
                value
              )}
            </td>
          );
        case "currency":
          return (
            <td className="p-2">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(value)}
            </td>
          );
        case "posNeg":
          return (
            <td
              className={`p-2 ${
                value > 0
                  ? "text-green-primary dark:text-green-primary-dark"
                  : value < 0
                  ? "text-accent-red"
                  : ""
              }`}
            >
              {value}
            </td>
          );
        case "email":
          return (
            <td className="p-2">
              <a
                href={`mailto:${value}`}
                className="text-accent-blue hover:underline"
              >
                {value}
              </a>
            </td>
          );
        default:
          return <td className="p-2">{value}</td>;
      }
    }

  if (column.numberFormat) {
    const format = column.numberFormat;
    const hasComma = format.includes(",");
    const hasDecimal = format.includes(".");

    // Extract the decimal part from the format if present
    const decimalPlacesMatch = format.match(/\.(\d+)/);
    const decimalPlaces = decimalPlacesMatch ? decimalPlacesMatch[1].length : 0;
    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
      useGrouping: hasComma, // Enable grouping by thousands separator
    };

    return (
      <td className="p-2">
        {Intl.NumberFormat(undefined, options).format(value)}{" "}
      </td>
    );
  }

  return <td className="p-2">{value}</td>;
};
