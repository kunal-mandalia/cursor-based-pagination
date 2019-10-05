import React from 'react';
import { UsersWithData } from './Users'
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        Cursor based pagination
        <UsersWithData />
      </header>
    </div>
  );
}

export default App;
