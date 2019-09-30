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

// knex.raw('SELECT * FROM app_user').then(
//   (version) => console.log((version)),
// ).catch((err) => { console.log(err); throw err; })
//   .finally(() => {
//     knex.destroy();
//   });

async function getUsers() {
  const result = await knex.raw('SELECT * FROM app_user');
  return result.rows;
}

module.exports = {
  getUsers,
};
