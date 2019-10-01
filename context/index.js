const repositories = require('./repositories');
const db = require('./db');
const Cursor = require('../util/cursor');

module.exports = {
  repositories: {
    user: new repositories.User({ db, Cursor }),
  },
};
