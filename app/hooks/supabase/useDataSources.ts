"use client";
import { useQuery } from "@tanstack/react-query";
import { supabaseBrowser } from "@/supabase/browser";
import { GroupedMetadataQueryResult, Metadata } from "@/types/supabase";

export const useDataSources = () => {
  const supabase = supabaseBrowser();

  return useQuery({
    queryKey: ["groupedMetadata"],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("ethereum")
        .from("metadata")
        .select("table_name, column_name, metadata");

      if (error) {
        throw new Error(error.message);
      }

      // Parse and validate data using Zod

      // Group the data by `table_name`
      const groupedData = data.reduce(
        (
          acc: Record<
            string,
            {
              table_name: string;
              columns: { column_name: string; metadata: Metadata }[];
            }
          >,
          curr
        ) => {
          const { table_name, column_name, metadata } = curr;

          if (!acc[table_name]) {
            acc[table_name] = { table_name, columns: [] };
          }
          const parsedMetadata = {
            unit: metadata?.unit || undefined,
            description: metadata?.description || undefined,
            value_type: metadata?.value_type || undefined,
          };

          acc[table_name].columns.push({
            column_name,
            metadata: parsedMetadata,
          });
          return acc;
        },
        {}
      );

      return Object.values(groupedData) as GroupedMetadataQueryResult;
    },
  });
};
