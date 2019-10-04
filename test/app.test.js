/* eslint-disable no-console */
const axios = require('axios').default;

const { start, stop } = require('../app');
const db = require('../context/db');

const port = 8081;
const baseEndpoint = `http://0.0.0.0:${port}`;


function createUsersQuery(first, last, before, after, sort) {
  const limit = first ? `first:${first}` : `last:${last}`;
  const beforeInput = before ? `,before:"${before}"` : '';
  const afterInput = after ? `,after:"${after}"` : '';
  const sortInput = sort ? `,sort: {field:${sort.field},order:${sort.order}}` : '';
  return `
  {
    Users(input: {${limit}${beforeInput}${afterInput}${sortInput}}) {
      edges {
        node {
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

function getNames(users) {
  return users.edges.map((edge) => edge.node.name);
}

async function findUsers({
  first = undefined, last = undefined, before = undefined, after = undefined, sort = undefined,
}, log = false) {
  const query = createUsersQuery(first, last, before, after, sort);
  if (log) { console.log(`query ${query}`); }
  const response = await axios.post(`${baseEndpoint}/graphql`, { query });
  if (response.data.errors) {
    console.error(response.data.errors);
  }
  return response.data.data.Users[0];
}

beforeAll(async () => {
  await start(port);
});

afterAll(async (done) => {
  await stop();
  await db.destroy();
  done();
});

describe('status endpoint', () => {
  it('should report UP', async () => {
    const { data } = await axios.get(`${baseEndpoint}/status`);
    expect(data).toEqual({ status: 'UP' });
  });
});

describe('users query', () => {
  it('should return correct number of users', async () => {
    const users = await findUsers({ first: 3 });
    expect(users.edges.length).toBe(3);
  });

  it('should be ordered by name ascendingly', async () => {
    const input = {
      first: 2,
      sort: { field: 'name', order: 'asc' },
    };
    const users = await findUsers(input);
    expect(users).toMatchSnapshot();
  });

  it('should be ordered by name descendingly', async () => {
    const input = {
      first: 2,
      sort: { field: 'name', order: 'desc' },
    };
    const users = await findUsers(input);
    expect(users).toMatchSnapshot();
  });

  it('should paginate after cursor', async () => {
    const input = {
      first: 2,
      after: '1517443200000___name_Carl_asc',
      sort: { field: 'name', order: 'asc' },
    };
    const users = await findUsers(input);
    expect(getNames(users)).toEqual(['Doug', 'Ed']);
    expect(users).toMatchSnapshot();
  });

  it('should paginate after cursor even with duplicates', async () => {
    const input = {
      first: 2,
      after: '1517443200000___age_22_asc',
      sort: { field: 'age', order: 'asc' },
    };
    const users = await findUsers(input);
    expect(getNames(users)).toEqual(['Ed', 'Doug']);
  });

  it('should paginate after cursor, sorted descendingly', async () => {
    const input = {
      first: 100,
      after: '1517443200000___age_22_desc',
      sort: { field: 'age', order: 'desc' },
    };
    const users = await findUsers(input);
    expect(getNames(users)).toEqual(['Zen', 'Bob', 'Doug', 'Ed']);
  });

  it('should paginate before cursor', async () => {
    const input = {
      first: 2,
      before: '1551398400000',
    };
    const users = await findUsers(input);
    expect(getNames(users)).toEqual(['Carl', 'Ed']);
  });

  it('should return last 2 results', async () => {
    const input = {
      last: 2,
    };
    const users = await findUsers(input);
    expect(getNames(users)).toEqual(['Doug', 'Zen']);
  });

  it('should paginate last 2 results before cursor', async () => {
    const input = {
      last: 2,
      before: '1564617600000',
    };
    const users = await findUsers(input);
    expect(getNames(users)).toEqual(['Alice', 'Bob']);
  });

  it('should paginate last 3 results before cursor with sort', async () => {
    const input = {
      last: 3,
      before: '1583020800000___age_90_asc',
      sort: { field: 'age', order: 'asc' },
    };
    const users = await findUsers(input);
    expect(getNames(users)).toEqual(['Ed', 'Bob', 'Doug']);
  });
});
