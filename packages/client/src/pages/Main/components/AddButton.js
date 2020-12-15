import React from 'react';
import { FiPlus } from 'react-icons/fi';

const AddButton = ({ handleClick }) => {
  return (
    <button
      onClick={handleClick}
      type="button"
      className="duration-300 transform outline-none tile-structure hover:bg-gray-200 hover:-translate-y-2 focus:outline-none">
      <div className="w-32 h-32">
        <div type="button" className="text-2xl box-button add">
          <FiPlus />
        </div>
      </div>

      <span className="tile-structure-name">Create new game.</span>
    </button>
  );
};

export default AddButton;
