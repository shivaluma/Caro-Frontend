import React from 'react';

import Square from './Square';

export default function Board(props) {
  const createBoard = () => {
    const temps = [];
    for (let i = 0; i < 20; i++) {
      const temp = [];
      for (let j = 0; j < 20; j++) {
        temp.push(<Square key={i * 20 + j} value={props.board[i][j]} />);
      }
      temps.push(
        <div className="board-row" key={i}>
          {temp}
        </div>
      );
    }

    return temps;
  };
  return <div>{createBoard()}</div>;
}
