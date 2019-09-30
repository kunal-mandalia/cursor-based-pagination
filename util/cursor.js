
function fromCursor(cursor) {
  return Number(cursor);
}

function fromEntity(entity) {
  return entity.created_at;
}

function toCursor(entity) {
  return entity.created_at;
}

const compareCursors = (direction = 'ASC') => (c1) => (c2) => {
  if (direction === 'ASC') {
    return c1 < c2;
  }
  return c2 < c1;
};

module.exports = {
  fromCursor,
  fromEntity,
  toCursor,
  compareCursors,
};
