import React, { useState } from 'react';
import { UsersWithData } from './Users'
import { Search } from './Search'
import './App.css';
import { UserSortField, SortOrder } from './globalTypes';

const App: React.FC = () => {
  const [search, setSearch] = useState({ first: 2, sort: { field: UserSortField.name, order: SortOrder.asc } });
  return (
    <div className="App">
      <header className="App-header">
        Cursor based pagination
        <Search search={search} setSearch={setSearch} />
        <UsersWithData search={search} />
      </header>
    </div>
  );
}

export default App;
