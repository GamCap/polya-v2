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
          hash: string;
          miner: string | null;
          nonce: string | null;
          number: number;
          parent_beacon_block_root: string | null;
          parent_hash: string | null;
          size: number | null;
          time: string;
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
          hash: string;
          miner?: string | null;
          nonce?: string | null;
          number: number;
          parent_beacon_block_root?: string | null;
          parent_hash?: string | null;
          size?: number | null;
          time: string;
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
          hash?: string;
          miner?: string | null;
          nonce?: string | null;
          number?: number;
          parent_beacon_block_root?: string | null;
          parent_hash?: string | null;
          size?: number | null;
          time?: string;
          total_difficulty?: number | null;
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
      Execution: {
        Row: {
          executed_at: string;
          id: string;
          query_id: string;
          result: Json;
          sql: string;
        };
        Insert: {
          executed_at?: string;
          id?: string;
          query_id: string;
          result: Json;
          sql: string;
        };
        Update: {
          executed_at?: string;
          id?: string;
          query_id?: string;
          result?: Json;
          sql?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Execution_query_id_fkey";
            columns: ["query_id"];
            isOneToOne: false;
            referencedRelation: "Query";
            referencedColumns: ["id"];
          }
        ];
      };
      Query: {
        Row: {
          created_at: string;
          id: string;
          name: string | null;
          owner: string;
          query: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name?: string | null;
          owner: string;
          query: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string | null;
          owner?: string;
          query?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Query_owner_fkey";
            columns: ["owner"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          }
        ];
      };
      User: {
        Row: {
          handle: string;
          id: string;
          name: string;
        };
        Insert: {
          handle: string;
          id?: string;
          name: string;
        };
        Update: {
          handle?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      Visualization: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          options: Json;
          query_id: string;
          type: Database["public"]["Enums"]["visualization_type"];
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          options: Json;
          query_id: string;
          type: Database["public"]["Enums"]["visualization_type"];
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          options?: Json;
          query_id?: string;
          type?: Database["public"]["Enums"]["visualization_type"];
        };
        Relationships: [
          {
            foreignKeyName: "Visualization_query_id_fkey";
            columns: ["query_id"];
            isOneToOne: false;
            referencedRelation: "Query";
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
      validate_table_options: {
        Args: {
          v_options: Json;
        };
        Returns: boolean;
      };
      validate_visualization_options: {
        Args: {
          v_type: Database["public"]["Enums"]["visualization_type"];
          v_options: Json;
        };
        Returns: boolean;
      };
    };
    Enums: {
      column_alignment: "left" | "center" | "right";
      custom_formatter:
        | "shortDate"
        | "date"
        | "number"
        | "shortNumber"
        | "fixedNumber"
        | "percent"
        | "currency"
        | "posNeg"
        | "email";
      filter_type: "range" | "boolean" | "multi-select" | "date-range";
      visualization_type: "table";
    };
    CompositeTypes: {
      [_ in never]: never;
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
