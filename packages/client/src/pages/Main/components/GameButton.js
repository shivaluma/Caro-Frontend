import React from 'react';

import { GiTicTacToe } from 'react-icons/gi';
import { MdLock } from 'react-icons/md';
import { IoPlayForward } from 'react-icons/io5';

const GameButton = ({ name, hasPassword = true, hasStarted = true }) => {
  const onClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="relative duration-300 transform group hover:-translate-y-2 ">
      <button
        type="button"
        onClick={onClick}
        className="flex outline-none tile-structure hover:bg-gray-200 focus:outline-none">
        <div className="relative w-32 h-32">
          <div className="text-6xl text-white bg-main box-button">
            <GiTicTacToe />
          </div>
          {hasPassword && <MdLock className="text-xl text-white right-icon" />}
          {hasStarted && <IoPlayForward className="text-xl text-white left-icon" />}
        </div>

        <span className="tile-structure-name">{name}</span>
      </button>
    </div>
  );
};

export default GameButton;
