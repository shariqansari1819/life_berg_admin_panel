// sharedSlice.js
import { createSlice } from '@reduxjs/toolkit';

const toggleSideBarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    toggleSideBar: true,
  },
  reducers: {
    setToggleSideBar: (state, action) => {
        state.toggleSideBar = !state.toggleSideBar;
    },
  },
});

export const { setToggleSideBar } = toggleSideBarSlice.actions;
export default toggleSideBarSlice.reducer;
