/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'init',
  initialState: true,
  reducers: {
    toggle(state, action) {
      return !state;
    },
  },
});

export const { toggle } = loadingSlice.actions;

export default loadingSlice.reducer;

// Actions

export const changeInit = () => async (dispatch) => {
  try {
    dispatch(toggle());
  } catch (e) {
    return console.error(e.message);
  }
};
