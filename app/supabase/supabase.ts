export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  ethereum: {
    Tables: {
      blocks: {
        Row: {
          base_fee_per_gas: number | null;
          blob_gas_used: number | null;
          date: string | null;
          difficulty: number | null;
          excess_blob_gas: number | null;
          gas_limit: number | null;
          gas_used: number | null;
          hash: string | null;
          miner: string | null;
          nonce: string | null;
          number: number;
          parent_beacon_block_root: string | null;
          parent_hash: string | null;
          size: number | null;
          time: string | null;
          total_difficulty: number | null;
        };
        Insert: {
          base_fee_per_gas?: number | null;
          blob_gas_used?: number | null;
          date?: string | null;
          difficulty?: number | null;
          excess_blob_gas?: number | null;
          gas_limit?: number | null;
          gas_used?: number | null;
          hash?: string | null;
          miner?: string | null;
          nonce?: string | null;
          number: number;
          parent_beacon_block_root?: string | null;
          parent_hash?: string | null;
          size?: number | null;
          time?: string | null;
          total_difficulty?: number | null;
        };
        Update: {
          base_fee_per_gas?: number | null;
          blob_gas_used?: number | null;
          date?: string | null;
          difficulty?: number | null;
          excess_blob_gas?: number | null;
          gas_limit?: number | null;
          gas_used?: number | null;
          hash?: string | null;
          miner?: string | null;
          nonce?: string | null;
          number?: number;
          parent_beacon_block_root?: string | null;
          parent_hash?: string | null;
          size?: number | null;
          time?: string | null;
          total_difficulty?: number | null;
        };
        Relationships: [];
      };
      metadata: {
        Row: {
          column_name: string;
          metadata:
            | Database["public"]["CompositeTypes"]["metadata_type"]
            | null;
          table_name: string;
        };
        Insert: {
          column_name: string;
          metadata?:
            | Database["public"]["CompositeTypes"]["metadata_type"]
            | null;
          table_name: string;
        };
        Update: {
          column_name?: string;
          metadata?:
            | Database["public"]["CompositeTypes"]["metadata_type"]
            | null;
          table_name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      executions: {
        Row: {
          executed_at: string;
          id: string;
          query_id: string;
          result: Json | null;
          sql: string;
        };
        Insert: {
          executed_at?: string;
          id?: string;
          query_id: string;
          result?: Json | null;
          sql: string;
        };
        Update: {
          executed_at?: string;
          id?: string;
          query_id?: string;
          result?: Json | null;
          sql?: string;
        };
        Relationships: [
          {
            foreignKeyName: "executions_query_id_fkey";
            columns: ["query_id"];
            isOneToOne: false;
            referencedRelation: "queries";
            referencedColumns: ["id"];
          }
        ];
      };
      queries: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          owner_id: string;
          query: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          owner_id: string;
          query: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          owner_id?: string;
          query?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "queries_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          handle: string;
          id: string;
          name: string;
          profile_image_url: string | null;
        };
        Insert: {
          handle: string;
          id?: string;
          name: string;
          profile_image_url?: string | null;
        };
        Update: {
          handle?: string;
          id?: string;
          name?: string;
          profile_image_url?: string | null;
        };
        Relationships: [];
      };
      visualizations: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          options: Database["public"]["CompositeTypes"]["table_options"] | null;
          query_id: string;
          type: Database["public"]["Enums"]["visualization_type_enum"];
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          options?:
            | Database["public"]["CompositeTypes"]["table_options"]
            | null;
          query_id: string;
          type: Database["public"]["Enums"]["visualization_type_enum"];
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          options?:
            | Database["public"]["CompositeTypes"]["table_options"]
            | null;
          query_id?: string;
          type?: Database["public"]["Enums"]["visualization_type_enum"];
        };
        Relationships: [
          {
            foreignKeyName: "visualizations_query_id_fkey";
            columns: ["query_id"];
            isOneToOne: false;
            referencedRelation: "queries";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_new_query: {
        Args: {
          p_query_text: string;
          p_owner: string;
        };
        Returns: {
          query_id: string;
          execution_id: string;
          visualization_id: string;
        }[];
      };
      update_query_and_create_execution: {
        Args: {
          p_query_id: string;
          p_query_text: string;
        };
        Returns: {
          execution_id: string;
          query_id: string;
        }[];
      };
      validate_formatter_options: {
        Args: {
          v_options: Json;
        };
        Returns: boolean;
      };
      validate_metadata: {
        Args: {
          v_metadata: Json;
        };
        Returns: boolean;
      };
      validate_table_options: {
        Args: {
          v_options: Json;
        };
        Returns: boolean;
      };
      validate_visualization_options: {
        Args: {
          v_type: Database["public"]["Enums"]["visualization_type_enum"];
          v_options: Json;
        };
        Returns: boolean;
      };
    };
    Enums: {
      align_content_enum: "left" | "center" | "right";
      custom_formatter_enum:
        | "shortDate"
        | "date"
        | "number"
        | "shortNumber"
        | "fixedNumber"
        | "percent"
        | "currency"
        | "posNeg"
        | "email";
      filter_type_enum: "range" | "boolean" | "multi-select" | "date-range";
      sort_direction_enum: "asc" | "desc";
      unit_enum: "timestamp" | "none" | "wei" | "date";
      value_type_enum:
        | "TIMESTAMPTZ"
        | "BIGINT"
        | "NUMERIC"
        | "INTEGER"
        | "TEXT"
        | "DATE";
      visualization_type_enum: "table" | "chart" | "graph" | "custom";
    };
    CompositeTypes: {
      column_type: {
        id: string | null;
        label: string | null;
        filterable: boolean | null;
        align_content: Database["public"]["Enums"]["align_content_enum"] | null;
        number_format: string | null;
        formatter_options:
          | Database["public"]["CompositeTypes"]["formatter_options"]
          | null;
        filter_type: Database["public"]["Enums"]["filter_type_enum"] | null;
        options: string[] | null;
        metadata: Database["public"]["CompositeTypes"]["metadata_type"] | null;
      };
      formatter_options: {
        regex_pattern: string | null;
        number_format: Json | null;
        date_format: string | null;
        custom_formatter:
          | Database["public"]["Enums"]["custom_formatter_enum"]
          | null;
      };
      metadata_type: {
        unit: Database["public"]["Enums"]["unit_enum"] | null;
        description: string | null;
        value_type: Database["public"]["Enums"]["value_type_enum"] | null;
      };
      table_options: {
        columns: Database["public"]["CompositeTypes"]["column_type"][] | null;
        page_size: number | null;
      };
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
