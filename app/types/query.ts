import { Visualization } from "./visualization";

export interface User {
  id: number;
  name: string;
  handle: string;
  profileImageUrl?: string | null;
}

export interface QueryOwnerFields {
  query: string;
  version: number;
}

export interface Query {
  id: number;
  name: string;
  query: string;
  createdAt: string;
  updatedAt: string;
  owner: User;
  visualizations: Visualization[];
  executions: number[];
}
