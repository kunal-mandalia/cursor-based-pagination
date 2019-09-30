const options = {
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'p@ssw0rd!',
    database: 'local',
  },
};

const knex = require('knex')(options);

module.exports = knex;
