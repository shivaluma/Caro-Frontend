/* eslint-disable react/display-name */
import { Avatar, Tag, Table, Space, Button, Spin } from 'antd';
import { TrophyOutlined, FacebookOutlined, GoogleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import API from 'api';
import dayjs from 'utils/day';

const User = ({ match, history }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  console.log(user);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(`/user/${match.params.id}`);
        console.log(data);
        setUser(data.data);
        // eslint-disable-next-line no-empty
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }

      try {
        const { data } = await API.get(`/match/user/${match.params.id}`);
        console.log(data);
        setMatches(data.data);
        // eslint-disable-next-line no-empty
      } catch (err) {
        console.log(err);
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
          {record?.firstPlayer?.displayName === record?.winner?.displayName && (
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
          {record?.secondPlayer?.displayName === record?.winner?.displayName && (
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
    <Spin spinning={loading}>
      {user && (
        <div className="flex flex-col">
          <div className="flex items-center">
            <Avatar
              size={64}
              src="https://i.pinimg.com/474x/58/36/63/583663b5e293ac71fab5ad283b627320.jpg"
            />
            <div className="flex flex-col ml-3">
              <div className="flex">
                <span className="font-semibold">{user.displayName}</span>
                <Tag className="ml-2" color="green">
                  {user.status}
                </Tag>
                <Tag className="ml-2" color="gold">
                  {user.isActive ? 'Activated' : 'Not Activated'}
                </Tag>
              </div>

              <span className="flex items-center font-semibold ">
                {user.wincount}W {user.drawcount}D {user.losecount}L
                <span className="flex items-center ml-4 font-semibold text-yellow-500">
                  <TrophyOutlined /> {user.point}
                </span>
              </span>

              <div className="flex mt-2">
                <Tag icon={<FacebookOutlined />} color={user.idFacebook ? '#3b5999' : '#ccc'}>
                  Facebook
                </Tag>
                <Tag icon={<GoogleOutlined />} color={user.idFacebook ? '#cd201f' : '#ccc'}>
                  Google
                </Tag>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <span className="text-lg font-semibold">Games played</span>
            <Table dataSource={matches} columns={columns} />
          </div>
        </div>
      )}

      {!user && <span>No user</span>}
    </Spin>
  );
};

export default User;
