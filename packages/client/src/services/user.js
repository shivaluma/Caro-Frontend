import API from '@caro/common/api';

export const getFullProfiles = async (id) => {
  const { data } = await API.get(`user/profile-full?id=${id}`);
  return data.data;
};
