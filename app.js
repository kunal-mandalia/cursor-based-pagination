/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('./graphql/middleware');

let instance;

const app = express();

const port = process.env.PORT || 8080;

app.use(cors());

app.get('/status', (_, res) => {
  res.json({ status: 'UP' });
});

app.use('/graphql', graphqlHTTP());

async function start(p = port) {
  return new Promise((resolve) => {
    instance = app.listen(p, () => {
      console.log(`cursor-based-pagination app running on ${p}`);
      return resolve();
    });
  });
}

async function stop() {
  return new Promise((resolve) => {
    instance.close();
    return resolve();
  });
}

module.exports = {
  start,
  stop,
};
