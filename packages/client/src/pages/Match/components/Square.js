import React from 'react';

export default function Square({ value }) {
  return (
    <>
      {value ? (
        <>
          {value === 'X' ? (
            <span className="text-red-600 square ">X</span>
          ) : (
            <span className="text-blue-600 square">O</span>
          )}
        </>
      ) : (
        <span className="square" />
      )}
    </>
  );
}
