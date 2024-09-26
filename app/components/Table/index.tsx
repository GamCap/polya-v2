import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { TablePagination } from "./TablePagination";
import { TableSearch } from "./TableSearch";
import { useState } from "react";
import { sortData } from "./tableUtils";
import Fuse, { IFuseOptions } from "fuse.js";
import { TableProps } from "./types";
import { CustomizeMenu } from "./CustomizeMenu";

export const Table: React.FC<TableProps> = ({
  data,
  columns,
  pageSize = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.id)
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
  };

  const handleFilter = (filters: { [key: string]: any }) => {
    setFilters(filters);
  };

  const applyFilters = (data: any[]) => {
    return data.filter((item) => {
      return Object.keys(filters).every((columnId) => {
        const filterValue = filters[columnId];
        const column = columns.find((col) => col.id === columnId);
        const value = item[columnId];

        if (column?.filterType === "range") {
          const min = filterValue?.min || -Infinity;
          const max = filterValue?.max || Infinity;
          return value >= min && value <= max;
        }

        if (column?.filterType === "boolean") {
          return value === (filterValue === "true");
        }

        if (column?.filterType === "multi-select") {
          return filterValue.includes(value);
        }

        if (column?.filterType === "date-range") {
          //TODO: Test this
          const start = new Date(filterValue?.start).getTime();
          const end = new Date(filterValue?.end).getTime();
          const valueDate = new Date(value).getTime();
          return valueDate >= start && valueDate <= end;
        }

        return true;
      });
    });
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
        <TableSearch onSearch={handleSearch} />
        <div className="flex flex-row gap-2 items-center justify-center">
          <CustomizeMenu
            columns={columns}
            visibleColumns={visibleColumns}
            onColumnVisibilityChange={handleColumnVisibilityChange}
            onFilter={handleFilter}
          />
        </div>
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
      <div className="shrink-0">
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={searchedData.length}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
