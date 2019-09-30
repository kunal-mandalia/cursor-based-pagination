const {
  fromCursor, fromEntity, toCursor, compareCursors,
} = require('../util/cursor');

const sortByUserSort = (userSort) => (a, b) => {
  const { field, order } = userSort;
  if (field === 'NAME') {
    return order === 'ASC' ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  }
  if (field === 'AGE') {
    return order === 'ASC' ? a.age < b.age : b.age < a.age;
  }

  return true;
};

function getUsers(data, first, after, sort) {
  let users = [...data];

  if (sort) {
    // TODO: sort across all sort options, not just the first
    users = users.sort(sortByUserSort(sort[0]));
  }

  if (after) {
    const cursor = fromCursor(after);
    users = users.filter((u) => compareCursors()(fromEntity(u))(cursor));
  }

  users = users.slice(0, first);

  return users;
}

const queries = {
  Users: async (_, { input: { first = 2, after, sort } }, context) => {
    const allUsers = await context.repositories.user.find();
    const data = getUsers(allUsers, first, after, sort);
    const pageInfo = {
      startCursor: data.length > 0 ? toCursor(data[0]) : null,
      endCursor: data.length > 0 ? toCursor(data[data.length - 1]) : null,
    };
    return [{
      edges: data.map((user) => ({
        node: user,
        cursor: toCursor(user),
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
