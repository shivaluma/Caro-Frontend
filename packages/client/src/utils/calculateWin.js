const calculateWin = (i, j, value, board) => {
  let count = 1;
  let row = i;
  let column = j;

  // check 1
  while (true) {
    if (++column > 19) break;
    if (board[row][column] !== value) break;
    count++;
    if (count === 5) return value;
  }

  row = i;
  column = j;
  while (true) {
    if (--column < 0) break;
    if (board[row][column] !== value) break;
    count++;
    if (count === 5) return value;
  }

  count = 1;
  row = i;
  column = j;

  // check 2
  while (true) {
    if (++row > 14) break;
    if (board[row][column] !== value) break;
    count++;
    if (count === 5) return value;
  }

  row = i;
  column = j;

  while (true) {
    if (--row < 0) break;
    if (board[row][column] !== value) break;
    count++;
    if (count === 5) return value;
  }

  count = 1;
  row = i;
  column = j;

  // check 3
  while (true) {
    if (++row > 14) break;
    if (++column > 19) break;
    if (board[row][column] !== value) break;
    count++;
    if (count === 5) return value;
  }

  row = i;
  column = j;

  while (true) {
    if (--row < 0) break;
    if (--column < 0) break;
    if (board[row][column] !== value) break;
    count++;
    if (count === 5) return value;
  }

  count = 1;
  row = i;
  column = j;

  // check 4
  while (true) {
    if (++row > 14) break;
    if (--column < 0) break;
    if (board[row][column] !== value) break;
    count++;
    if (count === 5) return value;
  }

  row = i;
  column = j;

  while (true) {
    if (--row < 0) break;
    if (++column > 19) break;
    if (board[row][column] !== value) break;
    count++;
    if (count === 5) return value;
  }

  return null;
};

export default calculateWin;
