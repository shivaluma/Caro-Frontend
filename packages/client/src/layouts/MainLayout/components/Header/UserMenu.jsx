import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signout } from 'slices/user';
import { toggleProfileSetting } from 'slices/profile';

const UserMenu = () => {
  const dispatch = useDispatch();
  const handleOpenUserProfileModal = () => {
    dispatch(toggleProfileSetting());
  };
  const displayName = useSelector((state) => state.user.username);

  return (
    <div className="z-0 flex flex-col w-48 overflow-hidden">
      <span className="px-5 py-3 mb-3 text-left tile-structure-name">
        Hi,
        {displayName}
      </span>
      <button
        type="button"
        className="px-5 py-3 text-left text-gray-400 border-b border-gray-200 outline-none focus:outline-none hover:bg-gray-200"
        onClick={handleOpenUserProfileModal}>
        Edit Profile
      </button>
      <button
        type="button"
        className="px-5 py-3 text-left text-gray-400 outline-none focus:outline-none hover:bg-gray-200"
        onClick={() => dispatch(signout())}>
        Sign Out
      </button>
    </div>
  );
};

export default UserMenu;
