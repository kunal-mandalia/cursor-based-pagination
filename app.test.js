const axios = require('axios').default;
const { start, stop } = require('./app');

const port = 8081;
const baseEndpoint = `http://localhost:${port}`;

beforeEach(async () => {
  await start(port);
});

afterEach(async () => { await stop(); });

test('status endpoint reports UP', async () => {
  const { data } = await axios.get(`${baseEndpoint}/status`);
  expect(data).toEqual({ status: 'UP' });
});
