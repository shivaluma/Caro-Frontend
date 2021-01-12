/* eslint-disable no-restricted-globals */
/* eslint-disable react/display-name */
import { Table, Tag, Button, Space } from 'antd';

const Match = ({ history }) => {
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
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => history.push(`/match/${record._id}`)}>
            View
          </Button>
        </Space>
      )
    }
  ];

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

  return (
    <div className="flex ">
      <div className="w-full">
        <span className="text-lg font-semibold">All Matches</span>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </div>
  );
};

export default Match;
