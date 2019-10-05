/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PaginatedSearch } from "./../../../types/globalTypes";

// ====================================================
// GraphQL query operation: Users
// ====================================================

export interface Users_Users_edges_node {
  __typename: "User";
  id: string;
  name: string;
  age: number;
  created_at: string;
}

export interface Users_Users_edges {
  __typename: "UserEdge";
  node: Users_Users_edges_node;
  cursor: string;
}

export interface Users_Users_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
}

export interface Users_Users {
  __typename: "UserConnection";
  edges: Users_Users_edges[] | null;
  pageInfo: Users_Users_pageInfo;
}

export interface Users {
  Users: Users_Users[] | null;
}

export interface UsersVariables {
  input?: PaginatedSearch | null;
}
