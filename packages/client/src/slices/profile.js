/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const profileShowingSlice = createSlice({
  name: 'profileSetting',
  initialState: {
    showProfile: false,
  },
  reducers: {
    toggle(state, action) {
      return { ...state, showProfile: !state.showProfile };
    },
  },
});

export const { toggle } = profileShowingSlice.actions;

export default profileShowingSlice.reducer;

// Actions

export const toggleProfileSetting = () => async (dispatch) => {
  try {
    dispatch(toggle());
  } catch (e) {
    return console.error(e.message);
  }
};
