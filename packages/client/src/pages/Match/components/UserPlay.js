/* eslint-disable no-nested-ternary */
import React from 'react';
import { Avatar } from 'antd';
import { ImTrophy } from 'react-icons/im';
import clsx from 'clsx';

export default function UserPlay({ user, winner, tick }) {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-64 bg-gray-100 rounded-md">
      {user ? (
        <>
          <span
            className={`w-5 h-5 text-lg ml-1absolute top-5 right-3 right-pane focus:outline-none font-bold ${
              tick === 'X' ? 'text-red-600' : 'text-blue-600'
            }`}>
            {tick}
          </span>
          <Avatar
            size={64}
            src="https://cdn.dribbble.com/users/4557429/avatars/small/open-uri20191213-19471-145569c?1576296398"
          />
          <span className="mt-2 text-base font-medium">{user.email}</span>
          <div className="flex text-xs font-semibold">
            <span className="text-green-600">{user.wincount || 0}W</span>
            <span className="ml-3 text-gray-600">{user.drawcount || 0}D</span>
            <span className="ml-3 text-red-600">{user.losecount || 0}L</span>
          </div>
          <span className="flex items-center mt-2 text-xs text-yellow-600">
            {user.point || 0}
            <ImTrophy className="ml-1" />
          </span>
          <span
            className={clsx(
              'px-3 py-2 font-semibold text-white rounded-md mt-1',
              // eslint-disable-next-line no-nested-ternary
              user._id === winner._id ? 'bg-green-600' : winner ? 'bg-red-600' : 'bg-yellow-600'
            )}>
            {
              // eslint-disable-next-line no-nested-ternary
              user._id === winner._id ? 'WIN' : winner ? 'LOSE' : 'DRAW'
            }
          </span>
        </>
      ) : null}
    </div>
  );
}
