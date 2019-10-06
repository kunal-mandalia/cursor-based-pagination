import React from 'react';
import { PaginatedSearch, UserSortField, SortOrder } from './globalTypes';

interface ISearch {
  search: PaginatedSearch;
  setSearch: any;
}

function nextSearchOrder(search: PaginatedSearch, field: UserSortField): SortOrder {
  if (search.sort) {
    if (search.sort.field === field) {
      return (search.sort.order === SortOrder.asc) ? SortOrder.desc : SortOrder.asc;
    }
  }
  return SortOrder.asc;
}

export function Search({ search, setSearch } : ISearch) {
  return <div style={{ display: 'flex', padding: '20px' }}>
      <button onClick={() => setSearch(() => ({
        ...search,
        sort: {
          field: UserSortField.name,
          order: nextSearchOrder(search, UserSortField.name)
        },
        before: undefined,
        after: undefined
      }))}>Sort by name (->{nextSearchOrder(search, UserSortField.name)})</button>

      <button onClick={() => setSearch(() => ({
        ...search,
        sort: {
          field: UserSortField.age,
          order: nextSearchOrder(search, UserSortField.age)
        },
        before: undefined,
        after: undefined
      }))}>Sort by age (->{nextSearchOrder(search, UserSortField.age)})</button>
    </div>
}