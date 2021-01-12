import API from '@caro/common/api';

const getAllRooms = async () => {
  const { data } = await API.get('rooms');
  return data.data;
};

const postCheckPassword = async (roomId, password) => {
  const { data } = await API.post(`rooms/check-password`, { roomId, password });
  return data;
};

const getRoomById = async (id, type) => {
  const { data } = await API.get(`rooms/${id}?type=${type}`);
  return data;
};

const getMatchById = async (id) => {
  const { data } = await API.get(`rooms/match/${id}`);
  return data;
};

export { getAllRooms, getRoomById, postCheckPassword, getMatchById };
