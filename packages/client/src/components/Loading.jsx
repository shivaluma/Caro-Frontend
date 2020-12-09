import { Spin } from 'antd';
import React from 'react';

const Loading = () => {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 z-40 flex items-center justify-center flex-grow w-screen h-screen bg-gray-100">
      <Spin size="large" />
    </div>
  );
};

export default Loading;
