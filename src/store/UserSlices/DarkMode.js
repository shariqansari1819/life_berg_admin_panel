// sharedSlice.js
import { createSlice } from '@reduxjs/toolkit';

const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState: {
    darkMode: false,
  },
  reducers: {
    setDarkMode: (state, action) => {
        state.darkMode = !state.darkMode;
    },
  },
});

export const { setDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;
