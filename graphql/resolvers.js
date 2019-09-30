const usersData = require('../data/users');

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

function getUsers(first, after, sort) {
  let users = [...usersData];

  if (sort) {
    // TODO: sort across all sort options, not just the first
    users = users.sort(sortByUserSort(sort[0]));
  }

  if (after) {
    const afterDate = new Date(after);
    users = users.filter((u) => new Date(u.created_at) > afterDate);
  }

  users = users.slice(0, first);

  return users;
}

const queries = {
  Users: (_, { input: { first = 2, after, sort } }) => {
    const data = getUsers(first, after, sort);
    const pageInfo = {
      startCursor: data.length > 0 ? data[0].created_at : null,
      endCursor: data.length > 0 ? data[data.length - 1].created_at : null,
    };
    return [{
      edges: data.map((user) => ({
        node: user,
        cursor: user.created_at,
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
  UpdateUser: () => usersData[0],
};

const resolvers = {
  Query: queries,
  Mutation: mutations,
  ...fields,
};

module.exports = resolvers;
