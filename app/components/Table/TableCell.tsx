import React from "react";
import { Column } from "@/types/supabase";
import { getFormatter } from "@/utils/formatters";

interface TableCellProps {
  item: any;
  column: Column;
}

export const TableCell: React.FC<TableCellProps> = ({ item, column }) => {
  const value = item[column.id];
  const formatter = getFormatter(column.formatterOptions);
  const formattedValue = formatter(value);

  return <td className="p-2">{formattedValue}</td>;
};
