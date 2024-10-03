import { Checkbox } from "@/components/ui/Checkbox";
import { TextInput } from "@/components/ui/TextInput";
import { Dropdown } from "../ui/Dropdown";
import { Column, CustomFormatterType, ValueTypeEnum } from "@/types/supabase";
import { FilterInputField } from "./FilterInputField";

interface CustomizeMenuColumnProps {
  column: Column;
  visibleColumns: string[];
  filters: { [key: string]: any };
  onFilterChange: (columnId: string, value: any) => void;
  onVisibilityChange: (columnId: string, visible: boolean) => void;
  onLabelChange: (columnId: string, newLabel: string) => void;
  onFormatterChange: (
    columnId: string,
    newFormatter: CustomFormatterType | undefined
  ) => void;
}

export const CustomizeMenuColumn: React.FC<CustomizeMenuColumnProps> = ({
  column,
  visibleColumns,
  filters,
  onFilterChange,
  onVisibilityChange,
  onLabelChange,
  onFormatterChange,
}) => {
  const isDisabled = !visibleColumns.includes(column.id);
  const valueType = column.metadata?.value_type as ValueTypeEnum;
  const allowedFormatters = formatterOptionsByValueType[valueType] || [];

  return (
    <div className="flex flex-col items-start gap-2 px-4 py-2">
      <div className="flex items-center gap-2">
        <Checkbox
          label={column.id}
          checked={visibleColumns.includes(column.id)}
          onChange={() =>
            onVisibilityChange(column.id, !visibleColumns.includes(column.id))
          }
        />
      </div>
      <TextInput
        value={column.label || column.id}
        onChange={(e) => onLabelChange(column.id, e.target.value)}
        placeholder="Column Label"
        isDisabled={isDisabled}
      />
      {/* Formatter selection */}
      {allowedFormatters.length > 0 && (
        <Dropdown
          options={allowedFormatters.map((formatter) => ({
            label: formatterOptionLabels[formatter],
            value: formatter,
          }))}
          extraOption={{ label: "Default", value: "none" }}
          value={column.formatterOptions?.customFormatter || "none"}
          onChange={(e) => {
            const selectedValue = e.target.value;
            const formatter =
              selectedValue === "none"
                ? undefined
                : (selectedValue as CustomFormatterType);
            onFormatterChange(column.id, formatter);
          }}
          disabled={isDisabled}
        />
      )}
      {column.filterable && (
        <div className="w-full h-12 relative">
          <FilterInputField
            column={column}
            filters={filters}
            isDisabled={isDisabled}
            onFilterChange={onFilterChange}
          />
        </div>
      )}
    </div>
  );
};

const formatterOptionsByValueType: Record<
  ValueTypeEnum,
  CustomFormatterType[]
> = {
  TIMESTAMPTZ: ["shortDate", "date"],
  DATE: ["shortDate", "date"],
  BIGINT: [
    "number",
    "shortNumber",
    "fixedNumber",
    "percent",
    "currency",
    "posNeg",
  ],
  NUMERIC: [
    "number",
    "shortNumber",
    "fixedNumber",
    "percent",
    "currency",
    "posNeg",
  ],
  INTEGER: [
    "number",
    "shortNumber",
    "fixedNumber",
    "percent",
    "currency",
    "posNeg",
  ],
  TEXT: ["email"],
};

const formatterOptionLabels: Record<CustomFormatterType, string> = {
  shortDate: "Short Date",
  date: "Date",
  number: "Number",
  shortNumber: "Short Number",
  fixedNumber: "Fixed Number",
  percent: "Percent",
  currency: "Currency",
  posNeg: "Positive/Negative",
  email: "Email",
};
