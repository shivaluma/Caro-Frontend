import React from 'react';

const QuickMatchButton = ({ handleClick }) => {
  return (
    <button
      onClick={handleClick}
      type="button"
      className="p-2 mr-2 text-white rounded-full new-button focus:outline-none">
      Quick Match
    </button>
  );
};

export default QuickMatchButton;
