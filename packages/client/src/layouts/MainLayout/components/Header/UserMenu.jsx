import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signout } from 'slices/user';
import { toggleProfileSetting } from 'slices/profile';
import { useHistory } from 'react-router-dom';

const UserMenu = () => {
  const user = useSelector((state) => state.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const handleOpenUserProfileModal = () => {
    history.push(`/profile/${user._id}`);
  };
  const displayName = useSelector((state) => state.user.email);

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
        Profile
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
