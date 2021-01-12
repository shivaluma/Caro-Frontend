/* eslint-disable react/display-name */

import { Space, Table, Button, Input } from 'antd';
import { useState, useRef } from 'react';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

const data = [
  {
    _id: '5ffabe2072e0b21bfb3e2208',
    email: 'shivaluma@gmail.com',
    role: 'user',
    displayName: 'shivaluma@gmail.com',
    idGoogle: null,
    active: false,
    idFacebook: null,
    point: 1000,
    wincount: 0,
    losecount: 0,
    drawcount: 0
  }
];

const Users = (props) => {
  const [searchState, setSearchState] = useState({
    searchText: '',
    searchedColumn: ''
  });

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
      dataIndex: '_id'
    },
    {
      title: 'Display Name',
      dataIndex: 'displayName',
      ...getColumnSearchProps('displayName')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ...getColumnSearchProps('email')
    },
    {
      title: 'Point',
      dataIndex: 'point',
      sorter: (a, b) => a.point - b.point
    },
    {
      title: 'Win Count',
      dataIndex: 'wincount',
      sorter: (a, b) => a.wincount - b.wincount
    },
    {
      title: 'Draw Count',
      dataIndex: 'drawcount',
      sorter: (a, b) => a.losecount - b.losecount
    },
    {
      title: 'Lose Count',
      dataIndex: 'losecount',
      sorter: (a, b) => a.losecount - b.losecount
    },

    {
      title: 'Active Status',
      dataIndex: 'active',
      render: (text, record) => <span>{record.active ? 'Actived' : 'Not Active'}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: [
        {
          text: 'Not banned',
          value: false
        },
        {
          text: 'Banned',
          value: true
        }
      ],
      render: (text, record) => <span>{record.isBanned ? 'Banned' : 'Normal'}</span>
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
          <Button type="primary" danger>
            Block
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Users;
