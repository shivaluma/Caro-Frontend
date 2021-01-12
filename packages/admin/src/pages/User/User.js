/* eslint-disable react/display-name */
import { Avatar, Tag, Table, Space, Button } from 'antd';
import { TrophyOutlined, FacebookOutlined, GoogleOutlined } from '@ant-design/icons';

const User = () => {
  const dataSource = [
    {
      _id: '5ffad6cb03550922120978fc',
      firstPlayer: { displayName: 'asdasd' },
      secondPlayer: { displayName: 'asdasd2' },
      chats: null,
      winner: { displayName: 'asdasd' },
      board: null,
      createAt: new Date().toISOString()
    },
    {
      _id: '5ffad6cb03550922120978fc',
      firstPlayer: { displayName: 'asdasd' },
      secondPlayer: { displayName: 'asdasd2' },
      chats: null,
      winner: { displayName: 'asdasd2' },
      board: null,
      createAt: new Date().toISOString()
    },
    {
      _id: '5ffad6cb03550922120978fc',
      firstPlayer: { displayName: 'asdasd' },
      secondPlayer: { displayName: 'asdasd2' },
      chats: null,
      winner: { displayName: 'asdasd' },
      board: null,
      createAt: new Date().toISOString()
    }
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: 'First Player',
      dataIndex: 'firstPlayer',
      key: 'firstPlayer',
      render: (text, record) => (
        <span>
          {record.firstPlayer.displayName}{' '}
          {record.firstPlayer.displayName === record.winner.displayName && (
            <Tag color="green">Winner</Tag>
          )}
        </span>
      )
    },
    {
      title: 'Second Player',
      dataIndex: 'secondPlayer',
      key: 'secondPlayer',
      render: (text, record) => (
        <span>
          {record.secondPlayer.displayName}{' '}
          {record.secondPlayer.displayName === record.winner.displayName && (
            <Tag color="green">Winner</Tag>
          )}
        </span>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (text, record) => <span>{record.createAt} </span>
    },
    {
      title: 'Action',
      key: 'action',
      sorter: true,
      render: () => (
        <Space size="middle">
          <Button type="primary">View</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <Avatar
          size={64}
          src="https://i.pinimg.com/474x/58/36/63/583663b5e293ac71fab5ad283b627320.jpg"
        />
        <div className="flex flex-col ml-3">
          <div className="flex">
            <span className="font-semibold">Shivaluma@gmail.com</span>
            <Tag className="ml-2" color="green">
              Normal
            </Tag>
            <Tag className="ml-2" color="gold">
              Not Activate
            </Tag>
          </div>

          <span className="flex items-center font-semibold ">
            3W 4D 2L
            <span className="flex items-center ml-4 font-semibold text-yellow-500">
              <TrophyOutlined /> 1000
            </span>
          </span>

          <div className="flex mt-2">
            <Tag icon={<FacebookOutlined />} color="#3b5999">
              Facebook
            </Tag>
            <Tag icon={<GoogleOutlined />} color="#cd201f">
              Google
            </Tag>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <span className="text-lg font-semibold">Games played</span>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </div>
  );
};

export default User;
