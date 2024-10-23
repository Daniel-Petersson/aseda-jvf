// src/store/calendarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  facilities: [],
  members: [],
  loading: false,
  error: null,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setEvents(state, action) {
      state.events = action.payload;
    },
    setFacilities(state, action) {
      state.facilities = action.payload;
    },
    setMembers(state, action) {
      state.members = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setEvents, setFacilities, setMembers, setLoading, setError } = calendarSlice.actions;
export default calendarSlice.reducer;