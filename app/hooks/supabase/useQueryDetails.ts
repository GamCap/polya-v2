"use client";
import { supabaseBrowser } from "@/supabase/browser";
import { QueryDetails, QueryDetailsSchema } from "@/types/supabase";
import { useQuery } from "@tanstack/react-query";

export const useQueryDetails = (queryId: string) =>
  useQuery<QueryDetails, Error>({
    queryKey: ["queryDetails", queryId],
    queryFn: async () => {
      if (!queryId) {
        return Promise.reject(new Error("Query ID is required"));
      }
      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from("queries")
        .select(
          `
            *,
            visualizations (*),
            executions (*)
          `
        )
        .eq("id", queryId)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("Query not found");
      }

      try {
        const queryDetails = QueryDetailsSchema.parse({
          id: data.id,
          name: data.name,
          query: data.query,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          ownerId: data.owner_id,
          visualizations: data.visualizations.map((v: any) => ({
            id: v.id,
            queryId: v.query_id,
            type: v.type,
            name: v.name,
            description: v.description,
            createdAt: v.created_at,
            options: v.options,
          })),
          executions: data.executions.map((e: any) => ({
            id: e.id,
            queryId: e.query_id,
            sql: e.sql,
            executedAt: e.executed_at,
            result: e.result,
          })),
        });

        return queryDetails;
      } catch (parseError) {
        throw new Error("Data parsing error");
      }
    },
  });
