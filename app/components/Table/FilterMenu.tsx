"use client";
import { useEffect, useState } from "react";
import { Column } from "./types";
import { Button } from "../ui/Button";
import { TextInput } from "../ui/TextInput";

interface FilterMenuProps {
  columns: Column[];
  onFilter: (filters: { [key: string]: any }) => void;
}

export const FilterMenu: React.FC<FilterMenuProps> = ({
  columns,
  onFilter,
}) => {
  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (columnId: string, value: any) => {
    setFilters({
      ...filters,
      [columnId]: value,
    });
  };

  const applyFilters = () => {
    onFilter(filters);
  };

  const renderInputField = (column: Column) => {
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
                handleInputChange(column.id, {
                  ...filters[column.id],
                  min: e.target.value,
                })
              }
            />
            <TextInput
              type="number"
              wrapperClassName="w-32"
              placeholder="Max"
              value={filters[column.id]?.max || ""}
              onChange={(e) =>
                handleInputChange(column.id, {
                  ...filters[column.id],
                  max: e.target.value,
                })
              }
            />
          </div>
        );
      case "boolean":
        return (
          <div className="flex gap-2">
            <label>
              <input
                type="radio"
                value="true"
                checked={filters[column.id] === "true"}
                onChange={() => handleInputChange(column.id, "true")}
              />
              True
            </label>
            <label>
              <input
                type="radio"
                value="false"
                checked={filters[column.id] === "false"}
                onChange={() => handleInputChange(column.id, "false")}
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
                  handleInputChange(column.id, newValue);
                }}
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
                handleInputChange(column.id, {
                  ...filters[column.id],
                  start: e.target.value,
                })
              }
            />
            <TextInput
              wrapperClassName="w-32"
              type="date"
              value={filters[column.id]?.end || ""}
              onChange={(e) =>
                handleInputChange(column.id, {
                  ...filters[column.id],
                  end: e.target.value,
                })
              }
            />
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const initialFilters: { [key: string]: any } = {};
    columns.forEach((column) => {
      if (column.filterType === "multi-select" && column.options) {
        initialFilters[column.id] = column.options;
      }
    });
    setFilters(initialFilters);
  }, [columns]);

  return (
    <div className="relative">
      {columns.some((column) => column.filterable) && (
        <>
          <Button
            variant="active"
            size="small"
            onClick={() => setIsOpen(!isOpen)}
          >
            Filter
          </Button>
          {isOpen && (
            <div className="bg-white dark:bg-[#2C2C2C] bg-opacity-10 dark:bg-opacity-20 backdrop-blur-sm rounded-sm text-basic-14-auto-regular w-fit absolute z-10 max-h-80 flex flex-col left-full -translate-x-full translate-y-1">
              <div className="flex flex-col grow overflow-y-auto scrollbar">
                {columns.map((column) => {
                  if (column.filterable) {
                    return (
                      <div
                        className="flex flex-col items-start gap-2 p-4"
                        key={column.id}
                      >
                        <div className="block text-sm cursor-pointer font-bold">
                          {column.label}
                        </div>
                        <div className="w-full h-12 relative">
                          {renderInputField(column)}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              <div className="sticky bottom-0  py-1 flex justify-end">
                <Button variant="subtle" onClick={applyFilters} size="medium">
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
