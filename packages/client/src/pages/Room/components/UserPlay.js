/* eslint-disable no-nested-ternary */
import React from 'react';
import { Avatar } from 'antd';
import { ImTrophy } from 'react-icons/im';
import { FiLogOut } from 'react-icons/fi';

export default function UserPlay({ user, pos, onPickPosition, currentUserPos }) {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-64 bg-gray-100 rounded-md">
      {user ? (
        <>
          {currentUserPos === pos && (
            <button
              className="absolute w-5 h-5 top-5 right-3 right-pane focus:outline-none"
              type="button"
              onClick={() => onPickPosition(null)}>
              <FiLogOut className="text-lg" />
            </button>
          )}
          <Avatar
            size={64}
            src="https://cdn.dribbble.com/users/4557429/avatars/small/open-uri20191213-19471-145569c?1576296398"
          />
          <span className="mt-2 text-base font-medium">{user.email}</span>
          <div className="flex text-xs font-semibold">
            <span className="text-green-600">{user.winNum || 0}W</span>
            <span className="ml-3 text-gray-600">{user.drawNum || 0}D</span>
            <span className="ml-3 text-red-600">{user.loseNum || 0}L</span>
          </div>
          <span className="flex items-center mt-2 text-xs text-yellow-600">
            {user.points || 0}
            <ImTrophy className="ml-1" />
          </span>{' '}
        </>
      ) : currentUserPos === null ? (
        <>
          <button
            onClick={() => onPickPosition(pos)}
            className="px-4 py-2 text-lg font-semibold text-white bg-gray-400 rounded-lg"
            type="button">
            Pick #{pos} position
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {}}
            className="px-4 py-2 text-lg font-semibold text-white bg-gray-400 rounded-lg"
            type="button">
            Waiting for other player
          </button>
        </>
      )}
    </div>
  );
}
