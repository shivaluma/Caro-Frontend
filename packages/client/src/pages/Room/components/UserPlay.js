import React from 'react';
import { Avatar } from 'antd';

export default function UserPlay() {
  const userPlay = {
    email: 'crepppro@gmail.com',
    winNum: 100,
    loseNum: 0,
    drawNum: 0,
  };
  return (
    <div className="user-play">
      <div className="justify-center user-row">
        <Avatar.Group>
          <Avatar src="https://cdn.dribbble.com/users/4557429/avatars/small/open-uri20191213-19471-145569c?1576296398" />
        </Avatar.Group>
        <span className="pl-3 font-bold">{userPlay.email}</span>
      </div>

      <div className="justify-between user-row">
        <div>
          <span className="font-bold">Win: </span>
          <span>{userPlay.winNum}</span>
        </div>

        <div>
          <span className="font-bold">Lose: </span>
          <span>{userPlay.loseNum}</span>
        </div>

        <div>
          <span className="font-bold">Draw: </span>
          <span>{userPlay.drawNum}</span>
        </div>
      </div>
    </div>
  );
}
