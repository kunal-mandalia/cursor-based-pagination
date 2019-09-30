class User {
  constructor({ db }) {
    this.db = db;
  }

  async getById(id) {
    const result = await this.db.from('app_user').where('id', id);
    return result;
  }

  async find() {
    const result = await this.db.raw('SELECT * FROM app_user');
    return result.rows;
  }
}

module.exports = User;
