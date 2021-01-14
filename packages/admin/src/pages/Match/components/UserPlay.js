/* eslint-disable no-nested-ternary */
import React from 'react';
import { TrophyOutlined, FacebookOutlined, GoogleOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

export default function UserPlay({ user }) {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-64 bg-gray-100 border-pink-500 rounded-md">
      {user && (
        <>
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
            <TrophyOutlined className="ml-1" />
          </span>
        </>
      )}
    </div>
  );
}
