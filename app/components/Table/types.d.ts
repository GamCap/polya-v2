import { Column } from "@/types/supabase";

interface TableProps {
  data: any[];
  columns: Column[];
  pageSize?: number;
}

export { TableProps };
