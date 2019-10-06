/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum SortOrder {
  asc = "asc",
  desc = "desc",
}

export enum UserSortField {
  age = "age",
  name = "name",
}

export interface PaginatedSearch {
  first?: number | null;
  last?: number | null;
  before?: string | null;
  after?: string | null;
  sort?: UserSortOption | null;
}

export interface UserSortOption {
  field?: UserSortField | null;
  order?: SortOrder | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
