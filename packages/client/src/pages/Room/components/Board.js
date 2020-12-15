import React from 'react';
import Square from './Square';

export default function Board() {
  const createBoard = () => {
    const temps = [];
    for (let i = 0; i < 15; i++) {
      const temp = [];
      for (let j = 0; j < 20; j++) {
        temp.push(
          <Square
          // value={props.squares[i * 3 + j]}
          // onClick={() => props.onClick(i * 3 + j)}
          // isBold={i * 3 + j === props.boldStep}
          // isWin={props.winStep.includes(i * 3 + j)}
          />
        );
      }
      temps.push(<div className="board-row">{temp}</div>);
    }
    console.log(temps);
    return temps;
  };
  return <div>{createBoard()}</div>;
}
