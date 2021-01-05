import React from 'react';

import { GiTicTacToe } from 'react-icons/gi';
import { MdLock } from 'react-icons/md';
import { FiUser } from 'react-icons/fi';
// import dayjs from 'utils/dayjs';
// import { IoPlayForward } from 'react-icons/io5';

const GameButton = ({ onClick, room, hasPassword = true, hasStarted = true }) => {
  // const [time, setTime] = useState(dayjs(room.createdAt).fromNow());

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTime(dayjs(room.createdAt).fromNow());
  //   }, 15000);

  //   return () => clearInterval(interval);
  // });

  return (
    <div className="relative duration-300 transform group hover:-translate-y-2 ">
      <button
        type="button"
        onClick={() => onClick(room.roomId)}
        className="flex outline-none tile-structure hover:bg-gray-200 focus:outline-none">
        <div className="relative w-32 h-32">
          <div className="text-6xl text-white bg-main box-button">
            <GiTicTacToe />
          </div>
          {hasPassword && hasStarted && <MdLock className="text-xl text-white right-icon" />}
          {room.firstPlayer && <FiUser className="text-xl font-semibold text-white user-icon" />}
          {room.secondPlayer && (
            <FiUser className="text-xl font-semibold text-white user-icon right-icon" />
          )}

          {/* {hasStarted && <IoPlayForward className="text-xl text-white left-icon" />} */}
        </div>
        <span className="tile-structure-name">#{room.roomId}</span>
      </button>
    </div>
  );
};

export default GameButton;
