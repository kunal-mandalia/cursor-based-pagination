class User {
  constructor({ db, Cursor }) {
    this.db = db;
    this.Cursor = Cursor;
  }

  async getById(id) {
    const result = await this.db.from('app_user').where('id', id);
    return result;
  }

  async find(first = 2, before, after, sort) {
    let cursorInfo;

    if (before && after) throw new Error('before and after cursors are mutually exclusive');

    if (after) {
      cursorInfo = this.Cursor.deserialize(after, sort);
    }

    const result = await this.db.from('app_user')
      .select('*')
      .modify((queryBuilder) => {
        if (cursorInfo) {
          if (cursorInfo.sort) {
            queryBuilder
              .where(cursorInfo.sort.field, `${cursorInfo.sort.order === 'asc' ? '<' : '>'}`, cursorInfo.sort.value)
              .orWhere(cursorInfo.sort.field, '=', cursorInfo.sort.value)
              .andWhere('created_at', '<', cursorInfo.created_at)
              .orderBy(cursorInfo.sort.field, cursorInfo.sort.order);
          } else {
            queryBuilder
              .where('created_at', '<', cursorInfo.created_at);
          }
        } else if (sort) {
          queryBuilder
            .orderBy(sort.field, sort.order);
        }
      })
      .orderBy('created_at', 'desc')
      .limit(first);
    return result;
  }
}

module.exports = User;
