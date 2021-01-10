/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import API from '@caro/common/api';

import socket from 'configs/socket';
import { initArray } from 'slices/online';
import { changeInit } from './init';
import { change } from './errors';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      const interval = setInterval(() => {
        if (socket && socket.connected) {
          socket.emit('user-online', action.payload);
          clearInterval(interval);
        }
      }, 100);
      return action.payload;
    },
    updateRoom(state, action) {
      state.room = action.payload;
      return state;
    },
    removeUser(state) {
      socket.emit('user-offline', state);
      return null;
    }
  }
});

export const { setUser, removeUser, updateRoom } = userSlice.actions;

export default userSlice.reducer;
// Actions

export const changeRoom = (roomId) => async (dispatch) => {
  dispatch(updateRoom(roomId));
};

export const signin = ({ email, password }) => async (dispatch) => {
  const res = await API.post('auth/signin', {
    email,
    password
  });

  if (res?.data?.data) {
    localStorage.setItem('whatisthis', res.data.data.accessToken);
    dispatch(setUser(res.data.data.user));
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
      confirmPassword
    });

    return res;
  } catch (e) {
    return e.response;
  }
};

export const initUserLoading = () => async (dispatch) => {
  try {
    const res = await API.get('user/me');
    const onlines = await API.get('user/online');

    if (res?.data?.data) {
      await dispatch(setUser(res.data.data));
    }
    await dispatch(initArray(onlines?.data?.data));

    return res;
  } catch (e) {
    if (!e.response) return e;
    dispatch(change({ payload: { error: e.response.data.message } }));
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
      displayName
    });
    dispatch(setUser(res.data.data));
    return true;
  } catch (e) {
    return false;
  }
};
