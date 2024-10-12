// src/hooks/useCalendarData.js
import { useState, useEffect } from 'react';
import BookingService from '../services/BookingService';
import { getAllOpeningHours } from '../services/OpeningHoursService';
import { getAllFacilities } from '../services/FacilityService';
import { getAllMembers } from '../services/MemberService';
import { getAvailabilityByFacility } from '../services/FacilityAvailabilityService';
import { getAllSchedules } from '../services/InstructorScheduleService';

const useCalendarData = () => {
  const [events, setEvents] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [facilitiesData, membersData, bookings, openingHours, availability, schedules] = await Promise.all([
        getAllFacilities(),
        getAllMembers(),
        BookingService.getAllBookings(),
        getAllOpeningHours(),
        getAvailabilityByFacility(),
        getAllSchedules()
      ]);

      setFacilities(facilitiesData.data);
      setMembers(membersData.data);

      const allEvents = [
        ...formatBookings(bookings),
        ...formatOpeningHours(openingHours.data),
        ...formatAvailability(availability.data),
        ...formatSchedules(schedules.data)
      ];

      setEvents(allEvents);
    } catch (err) {
      setError('Ett fel uppstod vid hämtning av data. Vänligen försök igen.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = () => {
    fetchData();
  };

  return { events, facilities, members, loading, error, refreshData };
};

export default useCalendarData;

// Helper functions to format data (implement these based on your data structure)
function formatBookings(bookings) { /* ... */ }
function formatOpeningHours(openingHours) { /* ... */ }
function formatAvailability(availability) { /* ... */ }
function formatSchedules(schedules) { /* ... */ }