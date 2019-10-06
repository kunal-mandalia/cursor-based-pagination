import { gql } from 'apollo-boost'

export const USERS = gql`
  query Users($input: PaginatedSearch) {
    users(input: $input) {
      edges {
        node {
          id
          name
          age
          created_at
        }
        cursor
      }
      pageInfo {
        endCursor
      }
    }
  }
`;