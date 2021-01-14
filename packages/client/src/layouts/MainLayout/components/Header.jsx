import { Avatar, Popover } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BiGame } from 'react-icons/bi';
import { useHistory } from 'react-router-dom';
import UserMenu from './Header/UserMenu';

const Header = ({ leftChild, rightChild }) => {
  const room = useSelector((state) => state.user.room);
  const history = useHistory();
  const handleMoveToMyRoom = () => {
    history.push(`/${room}`);
  };
  return (
    <div className="flex items-center justify-between flex-shrink-0 w-full h-20 px-6 border-b border-gray-300">
      <div className="flex items-center">
        <div className="p-3 bg-main rounded-xl">
          <Link to="/">
            <BiGame className="w-8 h-8 text-white rounded-sm" />
          </Link>
        </div>
        {leftChild && leftChild()}
      </div>

      <div className="flex items-center">
        {rightChild && rightChild()}

        {Number.isInteger(room) && (
          <button
            type="button"
            onClick={handleMoveToMyRoom}
            className="px-4 py-2 ml-3 font-semibold text-white rounded-full button bg-main focus:outline-none">
            #{room}
          </button>
        )}

        <div className="pl-6 ml-2 border-l border-gray-200">
          <Popover placement="bottomRight" content={UserMenu} trigger="focus">
            <Avatar
              tabIndex={-1}
              size={40}
              src="https://cdn.dribbble.com/users/4557429/avatars/small/open-uri20191213-19471-145569c?1576296398"
            />
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default Header;
