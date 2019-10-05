import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { User } from './User';
import { USERS } from './queries/Users'
import { Users as UsersData, UsersVariables } from './queries/types/Users'
import './Users.css';

interface IUsers {
  data: UsersData;
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
  if (!data || !data.Users) return <p>No data</p>;
  
  const endCursor = data.Users[0].pageInfo.endCursor;
  console.log('endCursor', endCursor);
  const hasMoreData = !!endCursor;
  return (
    <Users
      data={data}
      hasMoreData={hasMoreData}
      onLoadMore={() => {
        fetchMore({
          query: USERS,
          variables: { input: { first: 2, after: endCursor }},
          updateQuery: (previousResult, { fetchMoreResult }) => {
            console.log('fetchMoreResult', fetchMoreResult)
            const returnValue : UsersData = {
              Users: [
                {
                  edges: [...previousResult!.Users![0].edges!, ...fetchMoreResult!.Users![0].edges!],
                  pageInfo: {
                    endCursor: fetchMoreResult!.Users![0].pageInfo!.endCursor,
                    __typename: "PageInfo"
                  },
                  __typename: "UserConnection"
                }
              ],
            }
            return returnValue;
          }
        })
      }}
    />
  )
}

export const Users = ({ data, hasMoreData, onLoadMore } : IUsers) => {
  return (
    <>
      <div className="Users">
        {
          data.Users!.map(
            usersConnection => (
              usersConnection!.edges!
                .map(edge => <User key={edge.node.id} user={edge.node} />
                )
            )
          )
        }
      </div>
      {hasMoreData && <button onClick={onLoadMore}>fetch more</button>}
    </>
  )
}