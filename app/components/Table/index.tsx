// Table.tsx
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { TablePagination } from "./TablePagination";
import { TableSearch } from "./TableSearch";
import { useState } from "react";
import { sortData } from "./tableUtils";
import Fuse, { IFuseOptions } from "fuse.js";
import { TableProps } from "./types";
import { CustomizeMenu } from "./CustomizeMenu";
import { CustomFormatterType } from "@/types/supabase";

export const Table: React.FC<TableProps> = ({
  data,
  columns,
  pageSize = 5,
  onUpdateColumnVisibility,
  onUpdateColumnLabel,
  onUpdateColumnFormatter,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    columns.filter((col) => col.visible !== false).map((column) => column.id)
  );
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<{ [key: string]: any }>({});

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      if (sortDirection === "desc") {
        setSortColumn(null);
      }
      setSortDirection((prevDirection) =>
        prevDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const handleUpdateColumnFormatter = (
    columnId: string,
    newFormatter?: CustomFormatterType
  ) => {
    if (onUpdateColumnFormatter) {
      onUpdateColumnFormatter(columnId, newFormatter);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    if (query === searchQuery) return;
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleColumnVisibilityChange = (columnId: string, visible: boolean) => {
    if (visible) {
      setVisibleColumns([...visibleColumns, columnId]);
    } else {
      setVisibleColumns(visibleColumns.filter((id) => id !== columnId));
    }

    if (onUpdateColumnVisibility) {
      onUpdateColumnVisibility(columnId, visible);
    }
  };

  const handleFilter = (filters: { [key: string]: any }) => {
    setFilters(filters);
  };

  const handleLabelChange = (columnId: string, newLabel: string) => {
    if (onUpdateColumnLabel) {
      onUpdateColumnLabel(columnId, newLabel);
    }
  };

  const applyFilters = (data: any[]) => {
    //TODO: Implement filtering for now just return the data
    //look into Column.filterType and Column.options for filtering
    //filters should be seperate from customize menu, and should be applied to the data locally
    return data;
  };

  const fuseOptions: IFuseOptions<any> = {
    keys: columns.map((column) => column.id),
    threshold: 0.3,
    ignoreLocation: true,
  };

  const filteredData = applyFilters(data);
  const fuse = new Fuse(filteredData, fuseOptions);

  const searchedData = searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : filteredData;

  const sortedData = sortColumn
    ? sortData(searchedData, sortColumn, sortDirection)
    : searchedData;

  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="relative w-full h-full flex flex-col gap-2 dark:text-neutral-300 text-neutral-800 text-basic-10-auto-regular">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center justify-center"></div>
      </div>
      <div className="w-full h-full flex-1 overflow-y-scroll scrollbar">
        <table className="w-full">
          <TableHeader
            columns={columns}
            visibleColumns={visibleColumns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <TableBody
            data={paginatedData}
            columns={columns}
            visibleColumns={visibleColumns}
          />
        </table>
      </div>
      <div className="shrink-0 flex flex-row gap-2 items-center justify-start">
        <div className="flex-grow">
          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalCount={searchedData.length}
            onPageChange={handlePageChange}
          />
        </div>
        <TableSearch onSearch={handleSearch} />
        <CustomizeMenu
          columns={columns}
          visibleColumns={visibleColumns}
          onColumnVisibilityChange={handleColumnVisibilityChange}
          onFilter={handleFilter}
          onLabelChange={handleLabelChange}
          onFormatterChange={handleUpdateColumnFormatter}
        />
      </div>
    </div>
  );
};
