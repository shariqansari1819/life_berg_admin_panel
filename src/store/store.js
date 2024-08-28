// store.js

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'; // Import combineReducers from Redux
// import userReducer from './UserSlices/User';

import toggleSideBarReducer from "./UserSlices/ToggleSideBar";
import darkModeReducer from "./UserSlices/DarkMode"


// Combine your adminSlices into a single reducer
const rootReducer = combineReducers({
  toggleSideBar: toggleSideBarReducer,
  darkMode:darkModeReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
