export type CustomFormatter =
  | "shortDate"
  | "date"
  | "number"
  | "shortNumber"
  | "fixedNumber"
  | "percent"
  | "currency"
  | "posNeg"
  | "email";

export interface FormatterOptions {
  regexPattern?: string;
  numberFormat?: Intl.NumberFormatOptions;
  dateFormat?: string; // e.g., "MM/DD/YYYY"
  customFormatter?: CustomFormatter;
}

export interface Column {
  id: string;
  label?: string;
  filterable?: boolean;
  alignContent?: "left" | "center" | "right";
  numberFormat?: string; // e.g., "0,0[.]0"
  formatterOptions?: FormatterOptions;
  filterType?: "range" | "boolean" | "multi-select" | "date-range";
  options?: string[];
}
