/* eslint-disable no-restricted-globals */
/* eslint-disable react/display-name */
import { Table, Tag, Button, Space } from 'antd';
import { useEffect, useState } from 'react';
import API from 'api';
import dayjs from 'utils/day';

const Match = ({ history }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get('/matchs');

        setMatches(data.data);
        // eslint-disable-next-line no-empty
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
      render: (text, record) => <span>{dayjs(record.createAt).fromNow()} </span>
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

  return (
    <div className="flex ">
      <div className="w-full">
        <span className="text-lg font-semibold">All Matches</span>
        <Table loading={loading} dataSource={matches} columns={columns} />
      </div>
    </div>
  );
};

export default Match;
