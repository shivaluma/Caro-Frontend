import React from 'react';

const QuickMatchButton = ({ handleClick }) => {
  return (
    <button
      onClick={handleClick}
      type="button"
      className="p-2 text-lg text-white rounded-full new-button">
      Quick Match
    </button>
  );
};

export default QuickMatchButton;
