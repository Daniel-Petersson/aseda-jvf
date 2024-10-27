import { configureStore } from '@reduxjs/toolkit';
import calendarReducer from './calendarSlice'; // Import your calendar slice

const store = configureStore({
  reducer: {
    calendar: calendarReducer, // Add your calendar reducer
  },
});

export default store;