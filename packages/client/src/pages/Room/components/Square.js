import React from 'react';

export default function Square({ value, onClick }) {
  return (
    <>
      {value ? (
        <>
          {value === 'X' ? (
            <span className="text-red-600 square">X</span>
          ) : (
            <span className="text-blue-600 square">O</span>
          )}
        </>
      ) : (
        <button className="square" type="button" onClick={onClick} />
      )}
    </>
  );
}
