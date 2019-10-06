import React from 'react';
import { Users_users_edges_node } from './queries/types/Users'
import './User.css';

interface IUser {
  key: string;
  user: Users_users_edges_node;
}

export function User({ user } : IUser) {
  return <div className="User">
    <p>name: {user.name}</p>
    <p>age: {user.age}</p>
  </div>  
}
