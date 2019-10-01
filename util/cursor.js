class Cursor {
  static fieldMapper(field, value) {
    if (['age'].includes(field)) {
      return Number(value);
    }
    return value;
  }

  /**
   * @returns {string} e.g. 1583020800000__NAME_DESC
   */
  static serialize(entity, sort) {
    const timestamp = new Date(Number(entity.created_at)).getTime();

    let cursor = `${timestamp}`;

    if (sort) {
      cursor += `___${sort.field}_${entity[sort.field]}_${sort.order}`;
    }
    return cursor;
  }

  /**
   * @returns {object} { created_at, NAME, ASC }
   */
  static deserialize(cursor) {
    const data = {};
    const [timestamp, sort] = cursor.split('___');
    if (sort) {
      const [field, value, order] = sort.split('_');
      data.sort = {
        field,
        value: Cursor.fieldMapper(field, value),
        order,
      };
    }
    data.created_at = new Date(Number(timestamp));
    return data;
  }
}


module.exports = Cursor;
