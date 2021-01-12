import React from 'react';

export default function Square({ value, onClick, lastTick }) {
  return (
    <>
      {value ? (
        <>
          {value === 'X' ? (
            <span className={`text-red-600 square ${lastTick ? 'bg-gray-600' : ''}`}>X</span>
          ) : (
            <span className={`text-blue-600 square ${lastTick ? 'bg-gray-600' : ''}`}>O</span>
          )}
        </>
      ) : (
        <button className="square" type="button" onClick={onClick} />
      )}
    </>
  );
}
