import API from '@caro/common/api';

export const getFullProfiles = async (id) => {
  const { data } = await API.get(`user/profile-full?id=${id}`);
  return data.data;
};

export const getLeaderboards = async () => {
  const { data } = await API.get(`user/leaderboard`);
  return data.data;
};

export const postForgotPassword = async (email) => {
  const { data } = await API.post(`auth/forgot-password`, { email });
  return data.data;
};

export const postChangeNewPassword = async (password, token, email) => {
  const { data } = await API.post(`auth/change-password`, { password, token, email });
  return data.data;
};
