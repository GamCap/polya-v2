"use client";
import { useDataSources } from "@/hooks/supabase/useDataSources";
import { useState } from "react";

const DataSources = () => {
  const { data: dataSources, isLoading, error } = useDataSources();
  const [openTable, setOpenTable] = useState<string | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data sources</div>;

  const toggleAccordion = (tableName: string) => {
    setOpenTable(openTable === tableName ? null : tableName);
  };

  return (
    <div className="p-4 overflow-y-auto scrollbar h-full">
      {dataSources?.map((source) => (
        <div key={source.table_name} className="">
          <div
            className="cursor-pointer flex justify-between items-center pb-4 bg-gray-200 hover:bg-gray-300 text-title-12-auto-medium"
            onClick={() => toggleAccordion(source.table_name)}
          >
            <h2>{source.table_name}</h2>
            <span>{openTable === source.table_name ? "-" : "+"}</span>
          </div>

          {openTable === source.table_name && (
            <ul className="pl-2 text-basic-10-auto-regular flex flex-col gap-1">
              {source.columns.map((col) => (
                <li
                  key={col.column_name}
                  className="flex items-center justify-between hover:bg-gray-100"
                  title={col.metadata?.description}
                >
                  <span>{col.column_name}</span>
                  <span className="px-2 py-1 rounded-md dark:bg-white/10 bg-black/10 text-neutral-600 dark:text-neutral-400 text-[8px]">
                    {col.metadata?.value_type || ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default DataSources;
