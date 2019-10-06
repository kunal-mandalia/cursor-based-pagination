/* eslint-disable no-nested-ternary */

function getSortOrderBy(sort, isLast) {
  return isLast ? (sort.order === 'asc' ? 'desc' : 'asc') : sort.order;
}

function getSortWhereComparison(sort, isLast) {
  if (isLast) {
    return (sort.order === 'asc') ? '<' : '>';
  }
  return sort.order === 'asc' ? '>' : '<';
}

function buildFindUsersQuery(db, Cursor) {
  return async function query(first, last, before, after, sort) {
    // console.log('first, last, before, after, sort', first, last, before, after, sort);

    let cursorInfo;
    const isFirst = typeof first === 'number';
    const isLast = !isFirst;

    if (before && after) throw new Error('before and after cursors are mutually exclusive');

    if (before) {
      cursorInfo = Cursor.deserialize(before, sort);
    }
    if (after) {
      cursorInfo = Cursor.deserialize(after, sort);
    }
    // console.log('cursorInfo', cursorInfo);

    const data = await db.from('app_user')
      .select('*')
      .modify((queryBuilder) => {
        if (cursorInfo) {
          if (cursorInfo.sort) {
            queryBuilder
              .orderBy(sort.field, getSortOrderBy(sort, isLast))
              .where(
                cursorInfo.sort.field,
                getSortWhereComparison(sort, isLast),
                cursorInfo.sort.value,
              )
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
      .orderBy('created_at', `${isLast ? 'desc' : 'asc'}`)
      .limit(first || last);

    if (isLast) {
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
