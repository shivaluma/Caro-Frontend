import React from 'react';
import { FiPlus } from 'react-icons/fi';

const AddButton = ({ handleClick }) => {
  return (
    <button
      onClick={handleClick}
      type="button"
      className="p-2 text-lg text-white rounded-full new-button focus:outline-none">
      <FiPlus />
    </button>
  );
};

export default AddButton;
