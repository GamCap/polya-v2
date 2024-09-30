import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseBrowser } from "@/supabase/browser";

interface UpdateVisualizationOptionsInput {
  visualizationId: string;
  options: any;
}

export const useUpdateVisualizationOptions = () => {
  const queryClient = useQueryClient();
  const supabase = supabaseBrowser();

  return useMutation({
    mutationFn: async ({
      visualizationId,
      options,
    }: UpdateVisualizationOptionsInput) => {
      const { error } = await supabase
        .from("visualizations")
        .update({ options })
        .eq("id", visualizationId);

      if (error) {
        throw error;
      }
    },

    onSuccess: (_, { visualizationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["visualization", visualizationId],
      });
      queryClient.invalidateQueries({ queryKey: ["queryDetails"] });
    },
  });
};
