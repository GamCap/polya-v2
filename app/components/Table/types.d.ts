import { Column, CustomFormatterType } from "@/types/supabase";

export interface TableProps {
  data: any[];
  columns: Column[];
  pageSize?: number;
  onUpdateColumnVisibility?: (columnId: string, visible: boolean) => void;
  onUpdateColumnLabel?: (columnId: string, newLabel: string) => void;
  onUpdateColumnFormatter?: (
    columnId: string,
    newFormatter?: CustomFormatterType
  ) => void;
}
export { TableProps };
