import API from '@caro/common/api';

export const checkToken = async (email, token) => {
  const { data } = await API.get(`auth/check-token?token=${token}&email=${email}`);
  return data.data;
};
