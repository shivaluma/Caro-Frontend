import React from 'react';
import { Avatar } from 'antd';
import { ImTrophy } from 'react-icons/im';

export default function UserPlay({ user }) {
  const userPlay = {
    email: 'crepppro@gmail.com',
    winNum: 100,
    loseNum: 0,
    drawNum: 0,
    points: 1000,
  };
  return (
    <div className="flex flex-col items-center w-full py-10 bg-gray-100 rounded-md">
      {user ? (
        <>
          <Avatar
            size={64}
            src="https://cdn.dribbble.com/users/4557429/avatars/small/open-uri20191213-19471-145569c?1576296398"
          />
          <span className="mt-2 text-base font-medium">{userPlay.email}</span>
          <div className="flex text-xs font-semibold">
            <span className="text-green-600">{userPlay.winNum}W</span>
            <span className="ml-3 text-gray-600">{userPlay.drawNum}D</span>
            <span className="ml-3 text-red-600">{userPlay.loseNum}L</span>
          </div>
          <span className="flex items-center mt-2 text-xs text-yellow-600">
            {userPlay.points}
            <ImTrophy className="ml-1" />
          </span>{' '}
        </>
      ) : (
        <button className="px-4 py-2 text-lg font-semibold text-white rounded-lg bg-main" type="button">
          Pick this position
        </button>
      )}
    </div>
  );
}
