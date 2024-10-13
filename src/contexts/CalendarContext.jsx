import React, { createContext, useContext } from 'react';
import useCalendarData from '../hooks/useCalendarData';

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
  const { events, facilities, members, loading, error, refreshData } = useCalendarData();

  return (
    <CalendarContext.Provider value={{ events, facilities, members, loading, error, refreshData }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => useContext(CalendarContext);