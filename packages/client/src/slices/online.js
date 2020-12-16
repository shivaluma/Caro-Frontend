/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'online',
  initialState: [],
  reducers: {
    fill(state, action) {
      return action.payload;
    },
    add(state, action) {
      if (state.includes(action.payload)) return state;
      return [...state, action.payload];
    },
    remove(state, action) {
      return state.filter((el) => el !== action.payload);
    }
  }
});

export const { fill, add, remove } = loadingSlice.actions;

export default loadingSlice.reducer;

// Actions

export const initArray = (currentUserOnline) => async (dispatch) => {
  dispatch(fill(currentUserOnline));
};

export const addItem = (currentUserOnline) => async (dispatch) => {
  dispatch(add(currentUserOnline));
};

export const removeItem = (currentUserOnline) => async (dispatch) => {
  dispatch(remove(currentUserOnline));
};
