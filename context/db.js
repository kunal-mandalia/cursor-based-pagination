const options = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || '0.0.0.0',
    user: 'postgres',
    password: 'p@ssw0rd!',
    database: 'local',
  },
};

const knex = require('knex')(options);

module.exports = knex;
