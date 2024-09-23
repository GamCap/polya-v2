export const sortData = (
  data: Record<string, any>[],
  sortColumn: string,
  sortDirection: "asc" | "desc"
): Record<string, any>[] => {
  return [...data].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
};
