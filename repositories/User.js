/* eslint-disable no-nested-ternary */
function buildFindUsersQuery(db, Cursor) {
  return async function query(first, last, before, after, sort) {
    // console.log('first, last, before, after, sort', first, last, before, after, sort);

    let cursorInfo;

    if (before && after) throw new Error('before and after cursors are mutually exclusive');

    if (before) {
      cursorInfo = Cursor.deserialize(before, sort);
    }
    if (after) {
      cursorInfo = Cursor.deserialize(after, sort);
    }

    const data = await db.from('app_user')
      .select('*')
      .modify((queryBuilder) => {
        if (cursorInfo) {
          if (cursorInfo.sort) {
            queryBuilder
              .orderBy(cursorInfo.sort.field, `${last ? (cursorInfo.sort.order === 'asc' ? 'desc' : 'asc') : cursorInfo.sort.order}`)
              .where(cursorInfo.sort.field, `${last ? (cursorInfo.sort.order === 'asc' ? '<' : '>') : '>'}`, cursorInfo.sort.value)
              .orWhere(cursorInfo.sort.field, '=', cursorInfo.sort.value)
              .andWhere('created_at', `${before ? '<' : '>'}`, cursorInfo.created_at);
          } else {
            queryBuilder
              .where('created_at', `${before ? '<' : '>'}`, cursorInfo.created_at);
          }
        } else if (sort) {
          queryBuilder
            .orderBy(sort.field, sort.order);
        }
      })
      .orderBy('created_at', `${last ? 'desc' : 'asc'}`)
      .limit(first || last);

    if (last) {
      return data.sort((a, b) => a.created_at - b.created_at);
    }
    return data;
  };
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

  async find(first, last, before, after, sort) {
    const query = await buildFindUsersQuery(this.db, this.Cursor);
    const result = await query(first, last, before, after, sort);
    return result;
  }
}

module.exports = User;
