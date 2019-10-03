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

    const direction = this.Cursor.getPaginationDirection(before, after);

    if (before) {
      cursorInfo = this.Cursor.deserialize(before, sort);
    }
    if (after) {
      cursorInfo = this.Cursor.deserialize(after, sort);
    }

    const result = await this.db.from('app_user')
      .select('*')
      .modify((queryBuilder) => {
        if (cursorInfo) {
          if (cursorInfo.sort) {
            queryBuilder
              .orderBy(cursorInfo.sort.field, cursorInfo.sort.order)
              .where(cursorInfo.sort.field, `${cursorInfo.sort.order === 'asc' ? '>' : '<'}`, cursorInfo.sort.value)
              .orWhere(cursorInfo.sort.field, '=', cursorInfo.sort.value)
              .andWhere('created_at', '>', cursorInfo.created_at);
          } else {
            queryBuilder
              .where('created_at', '>', cursorInfo.created_at);
          }
        } else if (sort) {
          queryBuilder
            .orderBy(sort.field, sort.order);
        }
      })
      .orderBy('created_at', 'asc')
      .limit(first);
    return result;
  }
}

module.exports = User;
