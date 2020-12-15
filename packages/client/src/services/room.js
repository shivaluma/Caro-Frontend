import API from '@caro/common/api';

const getAllRooms = async () => {
  const { data } = await API.get('rooms');
  return data.data;
};

const getRoomById = async (id, type) => {
  const { data } = await API.get(`rooms/${id}?type=${type}`);
  return data;
};

export { getAllRooms, getRoomById };
