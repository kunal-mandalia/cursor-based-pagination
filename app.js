/* eslint-disable no-console */
const express = require('express');
const graphqlHTTP = require('./graphql/middleware');

const app = express();
const { getUsers } = require('./data/repository');

const port = process.env.PORT || 8080;

app.get('/status', (_, res) => {
  res.json({ status: 'UP' });
});

app.use('/graphql', graphqlHTTP());

app.listen(port, async () => {
  const users = await getUsers();
  console.log('>>> users', users);
  console.log(`cursor-based-pagination app running on ${port}`);
});
