interface Column {
  id: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: "range" | "boolean" | "multi-select" | "date-range";
  options?: string[];
  renderer?: (value: any) => React.ReactNode;
}

interface TableProps {
  data: any[];
  columns: Column[];
  pageSize?: number;
}

export { Column, TableProps };
