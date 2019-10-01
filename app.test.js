const axios = require('axios').default;
const { start, stop } = require('./app');

const port = 8081;
const baseEndpoint = `http://0.0.0.0:${port}`;

function createUsersQuery(first = 2, after) {
  return `
  {
    Users(input: {first: ${first}, ${after ? `, after:"${after}"` : ''}}) {
    
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

async function findUsers({ first, after = undefined }) {
  const query = createUsersQuery(first, after);
  const response = await axios.post(`${baseEndpoint}/graphql`, { query });
  return response.data.data.Users[0];
}

beforeAll(async () => {
  await start(port);
});

afterAll(async (done) => { await stop(); done(); });

test('status endpoint reports UP', async () => {
  const { data } = await axios.get(`${baseEndpoint}/status`);
  expect(data).toEqual({ status: 'UP' });
});

test('return correct number of users', async () => {
  const users = await findUsers({ first: 3 });
  expect(users.edges.length).toBe(3);
});

test('return users after cursor', async () => {
  const users = await findUsers({ first: 3, after: '1564617600000___age_30_asc' });
  expect(users.edges.length).toBe(2);
});
