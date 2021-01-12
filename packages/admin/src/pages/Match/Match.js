import { useState } from 'react';
import { Tag, Avatar } from 'antd';
import { TrophyOutlined, FacebookOutlined, GoogleOutlined } from '@ant-design/icons';
import { Board, UserPlay } from './components';

const Match = () => {
  const [match, setMatch] = useState({
    board: new Array(20).fill(new Array(20).fill(null)),
    _id: '5ffad6cb03550922120978fc',
    firstPlayer: { _id: '5ffad6cb03550922120978fc', displayName: 'asdasd' },
    secondPlayer: { displayName: 'asdasd2' },
    chats: null,
    winner: { _id: '5ffad6cb03550922120978fc', displayName: 'asdasd' },

    createAt: new Date().toISOString()
  });

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex flex-col">
        <div className="flex justify-center flex-1 mb-3">
          <div className="flex flex-col items-center mr-8">
            <Avatar
              size={64}
              src="https://i.pinimg.com/474x/58/36/63/583663b5e293ac71fab5ad283b627320.jpg"
            />
            <Tag className="mt-2" color="#87d068">
              Win
            </Tag>
            <div className="flex">
              <span className="font-semibold">Shivaluma@gmail.com</span>
            </div>

            <span className="flex items-center font-semibold ">3W 4D 2L</span>
            <span className="flex items-center font-semibold text-yellow-500">
              <TrophyOutlined /> 1000
            </span>
          </div>

          <div className="flex flex-col items-center ml-8">
            <Avatar
              size={64}
              src="https://i.pinimg.com/474x/58/36/63/583663b5e293ac71fab5ad283b627320.jpg"
            />
            <Tag className="mt-2" color="#f50">
              Lose
            </Tag>
            <div className="flex">
              <span className="font-semibold">Shivaluma@gmail.com</span>
            </div>

            <span className="flex items-center font-semibold ">3W 4D 2L</span>
            <span className="flex items-center font-semibold text-yellow-500">
              <TrophyOutlined /> 1000
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center flex-shrink-0 px-3 mx-2 ml-4 bg-gray-800 rounded-lg">
          <div className="p-3 play-area">
            <Board board={match?.board} />
          </div>
        </div>
      </div>

      <div className="flex lg:ml-12 lg:h-auto h-80">
        <div className="flex flex-col">
          <span className="text-lg font-semibold">Chats</span>

          <div className="relative flex flex-col flex-1 mt-4 bg-gray-100 rounded-lg w-80">
            <div className="absolute top-0 bottom-0 left-0 right-0 p-3 overflow-y-auto ">asd</div>
          </div>
        </div>
      </div>

      <div className="flex lg:ml-12 lg:h-auto h-80">
        <div className="flex flex-col">
          <span className="text-lg font-semibold">Moves</span>

          <div className="relative flex flex-col flex-1 mt-4 bg-gray-100 rounded-lg w-80 ">
            <div className="absolute top-0 bottom-0 left-0 right-0 p-3 overflow-y-auto ">asd</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Match;
