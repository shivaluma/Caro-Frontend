/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import API from '@caro/common/api';
import { changeInit } from './init';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    removeUser(state) {
      return null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;

// Actions

export const signin = ({ username, password }) => async (dispatch) => {
  const res = await API.post('auth/signin', {
    username,
    password,
  });
  if (res.data) {
    localStorage.setItem('whatisthis', res.data.accessToken);
    dispatch(setUser(res.data.payload));
  }
};

export const signinFacebook = ({ id, fbAccessToken }) => async (dispatch) => {
  try {
    const res = await API.post('auth/signin-facebook', { id, fbAccessToken });
    if (res?.data?.data) {
      localStorage.setItem('whatisthis', res.data.data.accessToken);
      dispatch(setUser(res.data.data.user));
    }

    return null;
  } catch (e) {
    return e.response;
  }
};

export const signinGoogle = ({ ggAccessToken }) => async (dispatch) => {
  try {
    const res = await API.post('auth/signin-google', { ggAccessToken });
    if (res?.data?.data) {
      await dispatch(setUser(res.data.data.user));
      localStorage.setItem('whatisthis', res.data.data.accessToken);
    }
    return null;
  } catch (e) {
    return e.response;
  }
};

export const signup = ({ email, password, confirmPassword }) => async (dispatch) => {
  try {
    const res = await API.post('auth/signup', {
      email,
      password,
      confirmPassword,
    });

    return res;
  } catch (e) {
    return e.response;
  }
};

export const initUserLoading = () => async (dispatch) => {
  try {
    const res = await API.get('user/me');

    if (!res.data.isError) {
      dispatch(setUser(res.data.data));
    }

    return res;
  } catch (e) {
    return e.response;
  } finally {
    dispatch(changeInit());
  }
};

export const signout = () => async (dispatch) => {
  localStorage.removeItem('whatisthis');
  dispatch(removeUser());
};

export const updateProfile = (displayName) => async (dispatch) => {
  try {
    const res = await API.put('/user', {
      displayName,
    });
    dispatch(setUser(res.data.data));
    return true;
  } catch (e) {
    return false;
  }
};
