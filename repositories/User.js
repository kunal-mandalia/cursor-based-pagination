function buildFindUsersQuery(db, Cursor, first, last, before, after, sort) {
  let cursorInfo;

  if (before && after) throw new Error('before and after cursors are mutually exclusive');

  if (before) {
    cursorInfo = Cursor.deserialize(before, sort);
  }
  if (after) {
    cursorInfo = Cursor.deserialize(after, sort);
  }

  return async () => db.from('app_user')
    .select('*')
    .modify((queryBuilder) => {
      //
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
}

class User {
  constructor({ db, Cursor }) {
    this.db = db;
    this.Cursor = Cursor;
  }

  async getById(id) {
    const result = await this.db.from('app_user').where('id', id);
    return result;
  }

  async find(first = 2, before, last, after, sort) {
    const query = await buildFindUsersQuery(this.db, this.Cursor, first, last, before, after, sort);
    const result = await query();
    return result;
  }
}

module.exports = User;
