/* eslint-disable no-empty */
/* eslint-disable react/display-name */

import { Space, Table, Button, Input } from 'antd';
import { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import API from 'api';

const Users = (props) => {
  const [searchState, setSearchState] = useState({
    searchText: '',
    searchedColumn: ''
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get('/users');
        setUsers(data.data);
        // eslint-disable-next-line no-empty
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchRef = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchState({ searchText: '' });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchRef.current = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}>
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchRef.current.select(), 100);
      }
    },
    render: (text) =>
      searchState.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchState.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  });

  const columns = [
    {
      title: 'ID',
      key: 'ID',
      dataIndex: '_id'
    },
    {
      title: 'Display Name',
      key: 'displayName',
      dataIndex: 'displayName',
      ...getColumnSearchProps('displayName')
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
      ...getColumnSearchProps('email')
    },
    {
      title: 'Point',
      key: 'point',

      dataIndex: 'point',
      sorter: (a, b) => a.point - b.point
    },
    {
      title: 'Win Count',
      key: 'wincount',
      dataIndex: 'wincount',
      sorter: (a, b) => a.wincount - b.wincount
    },
    {
      title: 'Draw Count',
      key: 'drawcount',
      dataIndex: 'drawcount',
      sorter: (a, b) => a.losecount - b.losecount
    },
    {
      title: 'Lose Count',
      key: 'losecount',
      dataIndex: 'losecount',
      sorter: (a, b) => a.losecount - b.losecount
    },

    {
      title: 'Active Status',
      key: 'active',
      dataIndex: 'active',
      render: (text, record) => <span>{record.active ? 'Actived' : 'Not Active'}</span>
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      filters: [
        {
          text: 'Banned',
          value: 'banned'
        },
        {
          text: 'Normal',
          value: 'normal'
        }
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (text, record) => <span>{record.status === 'banned' ? 'Banned' : 'Normal'}</span>
      // onFilter: (value, record) => record.address.indexOf(value) === 0
    },
    {
      title: 'Action',
      key: 'action',
      sorter: true,
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              props.history.push(`/user/${record._id}`);
            }}>
            View
          </Button>
          {!(record.status === 'banned') ? (
            <Button
              type="primary"
              onClick={async () => {
                try {
                  await API.post(`/user/${record._id}`, { status: 'banned' });
                  setUsers((prev) => {
                    const user = prev.find((el) => el._id === record._id);
                    user.status = 'banned';
                    return prev.map((el) => {
                      if (el.id === record._id) return user;
                      return el;
                    });
                  });
                } catch (err) {
                  console.log(err);
                }
              }}
              danger>
              Ban this account
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={async () => {
                try {
                  await API.post(`/user/${record._id}`, { status: 'normal' });
                  setUsers((prev) => {
                    const user = prev.find((el) => el._id === record._id);
                    user.status = 'normal';
                    return prev.map((el) => {
                      if (el.id === record._id) return user;
                      return el;
                    });
                  });
                } catch (err) {
                  console.log(err);
                }
              }}>
              Unban this account
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <Table loading={loading} columns={columns} dataSource={users} />
    </div>
  );
};

export default Users;
