import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { User } from './User';
import { USERS } from './queries/Users'
import { Users as UsersData, UsersVariables, Users_users } from './queries/types/Users'
import './Users.css';

interface IUsers {
  users: Users_users;
  hasMoreData: boolean;
  onLoadMore: any;
  children?: React.ReactNode;
}

export function UsersWithData() {
  const { loading, error, data, fetchMore } = useQuery<UsersData, UsersVariables>(USERS, {
    variables: {
      input: {
        first: 2
      }
    }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data || !data.users) return <p>No data</p>;
  
  const endCursor = data.users.pageInfo.endCursor;
  console.log('endCursor', endCursor);
  const hasMoreData = !!endCursor;
  return (
    <Users
      users={data.users}
      hasMoreData={hasMoreData}
      onLoadMore={() => {
        fetchMore({
          query: USERS,
          variables: { input: { first: 2, after: endCursor }},
          updateQuery: (previousResult, { fetchMoreResult }) => {
            console.log('fetchMoreResult', fetchMoreResult)
            const returnValue : UsersData = {
              users: {
                  edges: [...previousResult.users.edges, ...fetchMoreResult!.users.edges],
                  pageInfo: {
                    endCursor: fetchMoreResult!.users.pageInfo.endCursor,
                    __typename: "PageInfo"
                  },
                  __typename: "UserConnection"
                }
            }
            return returnValue;
          }
        })
      }}
    />
  )
}

export const Users = ({ users, hasMoreData, onLoadMore } : IUsers) => {
  return (
    <>
      <div className="Users">
        {users.edges.map(edge => <User key={edge!.node.id} user={edge!.node} />)}
      </div>
      {hasMoreData && <button onClick={onLoadMore}>fetch more</button>}
    </>
  )
}