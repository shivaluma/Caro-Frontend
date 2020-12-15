import API from '@caro/common/api';

const getAllRooms = async () => {
  const { data } = await API.get('rooms');

  return data.data;
};

export { getAllRooms };
