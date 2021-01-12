import API from '@caro/common/api';

export const getProfile = async (id) => {
  const { data } = await API.get(`user/profile?id=${id}`);
  return data.data;
};

export const getGameProfile = async (id) => {
  const { data } = await API.get(`user/profile-game?id=${id}`);
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

export const putActiveAccount = async (token, email) => {
  const { data } = await API.put(`user/active-account`, { token, email });
  return data.data;
};

export const resendActiveEmail = async (email) => {
  const { data } = await API.post(`auth/resend-email`, { email });
  return data.data;
};
