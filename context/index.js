const repositories = require('./repositories');
const db = require('./db');

module.exports = {
  repositories: {
    user: new repositories.User({ db }),
  },
};
