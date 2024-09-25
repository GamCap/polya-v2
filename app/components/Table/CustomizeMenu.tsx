"use client";
import { useEffect, useState, useRef } from "react";

import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { Column } from "@/types/supabase";

interface CustomizeMenuProps {
  columns: Column[];
  visibleColumns: string[];
  onFilter: (filters: { [key: string]: any }) => void;
  onColumnVisibilityChange: (columnId: string, visible: boolean) => void;
}

export const CustomizeMenu: React.FC<CustomizeMenuProps> = ({
  columns,
  visibleColumns,
  onFilter,
  onColumnVisibilityChange,
}) => {
  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (columnId: string, value: any) => {
    setFilters({
      ...filters,
      [columnId]: value,
    });
  };

  const applyFilters = () => {
    onFilter(filters);
  };

  const handleVisibilityChange = (columnId: string, visible: boolean) => {
    if (!visible) {
      // If the column is hidden, remove its filter
      const updatedFilters = { ...filters };
      delete updatedFilters[columnId];
      setFilters(updatedFilters);
      onFilter(updatedFilters);
    }
    onColumnVisibilityChange(columnId, visible);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsOpen(false); // Close modal if clicked outside
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const renderInputField = (column: Column) => {
    // Disable filtering if the column is hidden
    const isDisabled = !visibleColumns.includes(column.id);

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
              isDisabled={isDisabled}
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
                onChange={() => handleInputChange(column.id, "true")}
                disabled={isDisabled}
              />
              True
            </label>
            <label>
              <input
                type="radio"
                value="false"
                checked={filters[column.id] === "false"}
                onChange={() => handleInputChange(column.id, "false")}
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
                  handleInputChange(column.id, newValue);
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
                handleInputChange(column.id, {
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
                handleInputChange(column.id, {
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
    <div>
      <Button variant="active" size="small" onClick={() => setIsOpen(true)}>
        Customize
      </Button>
      {isOpen && (
        <div className="absolute inset-0 bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50 flex justify-center items-center z-50">
          <div
            ref={modalRef}
            className="bg-white dark:bg-[#2C2C2C] bg-opacity-10 dark:bg-opacity-20 backdrop-blur-sm rounded-md text-basic-14-auto-regular w-fit z-50 max-h-full flex flex-col"
          >
            <div className="flex flex-col grow min-h-0 overflow-y-auto scrollbar">
              {columns.map((column) => (
                <div
                  className="flex flex-col items-start gap-2 px-4 py-2"
                  key={column.id}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      label={column.label || column.id}
                      checked={visibleColumns.includes(column.id)}
                      onChange={() =>
                        handleVisibilityChange(
                          column.id,
                          !visibleColumns.includes(column.id)
                        )
                      }
                    />
                  </div>
                  {column.filterable && (
                    <div className="w-full h-12 relative">
                      {renderInputField(column)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="py-1 flex justify-end">
              <Button variant="subtle" onClick={applyFilters} size="medium">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
