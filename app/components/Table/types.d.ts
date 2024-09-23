import { Column } from "@/types";

interface TableProps {
  data: any[];
  columns: Column[];
  pageSize?: number;
}

export { TableProps };
