import React from "react";
import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";
import { Column } from "@/types/supabase";

interface FilterInputFieldProps {
  column: Column;
  filters: { [key: string]: any };
  isDisabled: boolean;
  onFilterChange: (columnId: string, value: any) => void;
}

export const FilterInputField: React.FC<FilterInputFieldProps> = ({
  column,
  filters,
  isDisabled,
  onFilterChange,
}) => {
  switch (column.filterType) {
    case "range":
      return (
        <div className="flex gap-2">
          <TextInput
            type="number"
            wrapperClassName="w-32"
            placeholder="Min"
            value={filters[column.id]?.min || ""}
            onChange={(e) =>
              onFilterChange(column.id, {
                ...filters[column.id],
                min: e.target.value,
              })
            }
            isDisabled={isDisabled}
          />
          <TextInput
            type="number"
            wrapperClassName="w-32"
            placeholder="Max"
            value={filters[column.id]?.max || ""}
            onChange={(e) =>
              onFilterChange(column.id, {
                ...filters[column.id],
                max: e.target.value,
              })
            }
            isDisabled={isDisabled}
          />
        </div>
      );
    case "boolean":
      return (
        <div className="flex gap-2" aria-disabled={isDisabled}>
          <label>
            <input
              type="radio"
              value="true"
              checked={filters[column.id] === "true"}
              onChange={() => onFilterChange(column.id, "true")}
              disabled={isDisabled}
            />
            True
          </label>
          <label>
            <input
              type="radio"
              value="false"
              checked={filters[column.id] === "false"}
              onChange={() => onFilterChange(column.id, "false")}
              disabled={isDisabled}
            />
            False
          </label>
        </div>
      );
    case "multi-select":
      return (
        <div className="absolute left-0 right-0 flex flex-row items-center gap-2 overflow-x-auto scrollbar py-2">
          {column.options?.map((option) => (
            <Button
              key={option}
              variant={
                filters[column.id]?.includes(option) ? "primary" : "active"
              }
              size="xsmall"
              onClick={() => {
                const newValue = filters[column.id]?.includes(option)
                  ? filters[column.id].filter((v: any) => v !== option)
                  : [...(filters[column.id] || []), option];
                onFilterChange(column.id, newValue);
              }}
              disabled={isDisabled}
            >
              {option}
            </Button>
          ))}
        </div>
      );
    case "date-range":
      return (
        <div className="flex gap-2">
          <TextInput
            wrapperClassName="w-32"
            type="date"
            value={filters[column.id]?.start || ""}
            onChange={(e) =>
              onFilterChange(column.id, {
                ...filters[column.id],
                start: e.target.value,
              })
            }
            isDisabled={isDisabled}
          />
          <TextInput
            wrapperClassName="w-32"
            type="date"
            value={filters[column.id]?.end || ""}
            onChange={(e) =>
              onFilterChange(column.id, {
                ...filters[column.id],
                end: e.target.value,
              })
            }
            isDisabled={isDisabled}
          />
        </div>
      );
    default:
      return null;
  }
};
