/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PaginatedSearch } from "./../../../types/globalTypes";

// ====================================================
// GraphQL query operation: Users
// ====================================================

export interface Users_users_edges_node {
  __typename: "User";
  id: string;
  name: string;
  age: number;
  created_at: string;
}

export interface Users_users_edges {
  __typename: "UserEdge";
  node: Users_users_edges_node;
  cursor: string;
}

export interface Users_users_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
}

export interface Users_users {
  __typename: "UserConnection";
  edges: (Users_users_edges | null)[];
  pageInfo: Users_users_pageInfo;
}

export interface Users {
  users: Users_users;
}

export interface UsersVariables {
  input?: PaginatedSearch | null;
}
