const axios = require('axios').default;
const { start, stop } = require('./app');

const port = 8081;
const baseEndpoint = `http://0.0.0.0:${port}`;


function createUsersQuery(first = 2, after, sort) {
  const firstInput = `first:${first}`;
  const afterInput = after ? `,after:"${after}"` : '';
  const sortInput = sort ? `,sort: {field:${sort.field},order:${sort.order}}` : '';
  return `
  {
    Users(input: {${firstInput}${afterInput}${sortInput}}) {
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
}

async function findUsers({ first, after = undefined, sort = undefined }) {
  const query = createUsersQuery(first, after, sort);
  const response = await axios.post(`${baseEndpoint}/graphql`, { query });
  return response.data.data.Users[0];
}

async function wait(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

beforeAll(async () => {
  await start(port);
});

afterAll(async (done) => {
  await stop();
  await wait();
  done();
});

test('status endpoint reports UP', async () => {
  const { data } = await axios.get(`${baseEndpoint}/status`);
  expect(data).toEqual({ status: 'UP' });
});

test('return correct number of users', async () => {
  const users = await findUsers({ first: 3 });
  expect(users.edges.length).toBe(3);
});

test('users should be ordered by name ascendingly', async () => {
  const input = {
    first: 2,
    sort: { field: 'name', order: 'asc' },
  };
  const users = await findUsers(input);
  expect(users).toMatchSnapshot();
});

test('users should be ordered by name descendingly', async () => {
  const input = {
    first: 2,
    sort: { field: 'name', order: 'desc' },
  };
  const users = await findUsers(input);
  expect(users).toMatchSnapshot();
});
