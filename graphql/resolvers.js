const Cursor = require('../util/cursor');


const queries = {
  Users: async (_, {
    input: {
      first, last, before, after, sort,
    },
  }, context) => {
    const data = await context.repositories.user.find(first, last, before, after, sort);
    const pageInfo = {
      startCursor: data.length > 0 ? Cursor.serialize(data[0], sort) : null,
      endCursor: data.length > 0 ? Cursor.serialize(data[data.length - 1], sort) : null,
    };
    return [{
      edges: data.map((user) => ({
        node: user,
        cursor: Cursor.serialize(user, sort),
      })),
      pageInfo,
    }];
  },
};

const fields = {
  User: {
    randomQuote: (user) => `${user.name} likes the number ${Math.floor(Math.random() * 100)}`,
  },
};

const mutations = {
  UpdateUser: () => [],
};

const resolvers = {
  Query: queries,
  Mutation: mutations,
  ...fields,
};

module.exports = resolvers;
