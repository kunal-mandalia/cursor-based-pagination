const express = require('express');
const graphqlHTTP = require('./graphql/middleware');

const app = express();
const port = process.env.PORT || 8080;

app.get('/status', (_, res) => {
  res.json({ status: 'UP' });
});

app.use('/graphql', graphqlHTTP());

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`cursor-based-pagination app running on ${port}`);
});
