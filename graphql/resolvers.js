const usersData = require('../data/users');

const queries = {
  Users: () => {
    const data = usersData;
    return [{
      edges: data.map((user) => ({
        node: user,
        cursor: user.created_at,
      })),
      pageInfo: {
        startCursor: data[0].created_at,
        endCursor: data[data.length - 1].created_at,
      },
    }];
  },
};

const fields = {
  User: {
    randomQuote: (user) => `${user.name} likes the number ${Math.floor(Math.random() * 100)}`,
  },
};

const mutations = {
  UpdateUser: () => usersData[0],
};

const resolvers = {
  Query: queries,
  Mutation: mutations,
  ...fields,
};

module.exports = resolvers;
