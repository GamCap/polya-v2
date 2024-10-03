"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Column, CustomFormatterType } from "@/types/supabase";
import { CustomizeMenuColumn } from "./CustomizeMenuColumn";

interface CustomizeMenuProps {
  columns: Column[];
  visibleColumns: string[];
  onFilter: (filters: { [key: string]: any }) => void;
  onColumnVisibilityChange: (columnId: string, visible: boolean) => void;
  onLabelChange?: (columnId: string, newLabel: string) => void;
  onFormatterChange?: (
    columnId: string,
    newFormatter: CustomFormatterType | undefined
  ) => void;
}

export const CustomizeMenu: React.FC<CustomizeMenuProps> = ({
  columns,
  visibleColumns,
  onFilter,
  onColumnVisibilityChange,
  onLabelChange,
  onFormatterChange,
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
      const updatedFilters = { ...filters };
      delete updatedFilters[columnId];
      setFilters(updatedFilters);
      onFilter(updatedFilters);
    }
    onColumnVisibilityChange(columnId, visible);
  };

  const handleLabelChangeLocal = (columnId: string, newLabel: string) => {
    if (onLabelChange) {
      onLabelChange(columnId, newLabel);
    }
  };

  const handleFormatterChangeLocal = (
    columnId: string,
    newFormatter: CustomFormatterType | undefined
  ) => {
    if (onFormatterChange) {
      onFormatterChange(columnId, newFormatter);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsOpen(false);
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

  return (
    <div>
      <Button variant="active" size="small" onClick={() => setIsOpen(true)}>
        Customize
      </Button>
      {isOpen && (
        <div className="absolute inset-0 bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50 flex justify-center items-center z-50">
          <div
            ref={modalRef}
            className="bg-white dark:bg-[#2C2C2C] bg-opacity-10 dark:bg-opacity-20 backdrop-blur-sm rounded-md text-basic-10-auto-regular w-fit z-50 max-h-full flex flex-col"
          >
            <div className="flex flex-wrap grow min-h-0 overflow-y-auto scrollbar gap-4">
              {columns.map((column) => (
                <div
                  className="flex-grow flex-basis-0 min-w-[200px]"
                  key={column.id}
                >
                  <CustomizeMenuColumn
                    column={column}
                    visibleColumns={visibleColumns}
                    filters={filters}
                    onFilterChange={handleInputChange}
                    onVisibilityChange={handleVisibilityChange}
                    onLabelChange={handleLabelChangeLocal}
                    onFormatterChange={handleFormatterChangeLocal}
                  />
                </div>
              ))}
            </div>
            <div className="py-1 flex justify-end">
              <Button
                variant="subtle"
                onClick={() => setIsOpen(false)}
                size="small"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
