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
      if (state.findIndex((u) => u._id === action.payload._id) === -1)
        return [...state, action.payload];

      return state;
    },

    remove(state, action) {
      console.log(state);
      console.log(action);
      return state.filter((el) => el._id !== action.payload._id);
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
