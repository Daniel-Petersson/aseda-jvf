import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, useMediaQuery, useTheme, Button } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import svLocale from '@fullcalendar/core/locales/sv';
import { AuthContext } from '../utils/AuthContext';
import * as BookingService from '../services/BookingService';
import * as OpeningHoursService from '../services/OpeningHoursService';
import * as InstructorScheduleService from '../services/InstructorScheduleService';
import EventDetailsModal from '../components/common/EventDetailsModal';
import * as FacilityService from '../services/FacilityService';
import * as MemberService from '../services/MemberService';


const Calendar = () => {
  const [events, setEvents] = useState([]);
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  console.log('User object:', user);
  console.log('User role:', user?.role);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    try {
      console.log('Fetching all events...');
      const [bookingsResponse, openingHoursResponse, instructorSchedulesResponse] = await Promise.all([
        BookingService.getAllBookings(),
        OpeningHoursService.getAllOpeningHours(),
        InstructorScheduleService.getAllSchedules()
      ]);

      console.log('Bookings response:', bookingsResponse);
      console.log('Opening hours response:', openingHoursResponse);
      console.log('Instructor schedules response:', instructorSchedulesResponse);

      const formattedBookings = await formatBookings(bookingsResponse);
      const formattedOpeningHours = await formatOpeningHours(openingHoursResponse.data);
      const formattedInstructorSchedules = await formatInstructorSchedules(instructorSchedulesResponse.data);

      const formattedEvents = [
        ...formattedBookings,
        ...formattedOpeningHours,
        ...formattedInstructorSchedules
      ];

      console.log('Formatted events:', formattedEvents);
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const formatBookings = async (bookings) => {
    const formattedBookings = await Promise.all(bookings.map(async booking => {
      const facilityResponse = await FacilityService.getFacilityById(booking.facilityId);
      return {
        id: booking.id,
        title: `Bokning: ${booking.title}`,
        start: booking.startTime,
        end: booking.endTime,
        backgroundColor: 'rgba(93, 102, 81, 0.2)',
        borderColor: '#5D6651',
        textColor: '#5D6651',
        extendedProps: { 
          type: 'booking', 
          ...booking,
          facilityName: facilityResponse.data.name
        }
      };
    }));
    return formattedBookings;
  };

  const formatOpeningHours = async (openingHours) => {
    const formattedOpeningHours = await Promise.all(openingHours.map(async oh => {
      const facilityResponse = await FacilityService.getFacilityById(oh.facilityId);
      return {
        id: `oh-${oh.facilityId}`,
        title: `Öppettider: ${facilityResponse.data.name}`,
        start: oh.openingTime,
        end: oh.closingTime,
        backgroundColor: 'rgba(212, 161, 94, 0.2)',
        borderColor: '#D4A15E',
        textColor: '#5D6651',
        extendedProps: { 
          type: 'openingHours', 
          ...oh,
          facilityName: facilityResponse.data.name
        }
      };
    }));
    return formattedOpeningHours;
  };

  const formatInstructorSchedules = async (schedules) => {
    const formattedSchedules = await Promise.all(schedules.map(async schedule => {
      const [facilityResponse, instructorResponse] = await Promise.all([
        FacilityService.getFacilityById(schedule.facilityId),
        MemberService.getMember(schedule.instructorId)
      ]);
      return {
        id: schedule.id,
        title: `Instruktör: ${instructorResponse.data.firstName} ${instructorResponse.data.lastName}`,
        start: schedule.startTime,
        end: schedule.endTime,
        backgroundColor: '#F0F0F0',
        borderColor: '#D4A15E',
        textColor: '#5D6651',
        extendedProps: { 
          type: 'instructorSchedule', 
          ...schedule,
          facilityName: facilityResponse.data.name,
          instructorName: `${instructorResponse.data.firstName} ${instructorResponse.data.lastName}`
        }
      };
    }));
    return formattedSchedules;
  };

  const handleEventClick = async (clickInfo) => {
    const eventType = clickInfo.event.extendedProps.type;
    if (eventType === 'openingHours') {
      const facilityId = clickInfo.event.extendedProps.facilityId;
      const assignedLeaderId = clickInfo.event.extendedProps.assignedLeaderId;
      const [facilityResponse, instructorResponse] = await Promise.all([
        FacilityService.getFacilityById(facilityId),
        MemberService.getMember(assignedLeaderId)
      ]);
      if (facilityResponse.success && instructorResponse.success) {
        setSelectedEvent({
          ...clickInfo.event.extendedProps,
          facilityName: facilityResponse.data.name,
          assignedLeaderName: `${instructorResponse.data.firstName} ${instructorResponse.data.lastName}`
        });
        setIsModalOpen(true);
      } else {
        console.error('Error fetching details:', facilityResponse.error || instructorResponse.error);
      }
    } else if (eventType === 'booking') {
      const facilityId = clickInfo.event.extendedProps.facilityId;
      const memberId = clickInfo.event.extendedProps.memberId;
      const [facilityResponse, memberResponse] = await Promise.all([
        FacilityService.getFacilityById(facilityId),
        MemberService.getMember(memberId)
      ]);
      if (facilityResponse.success && memberResponse.success) {
        setSelectedEvent({
          ...clickInfo.event.extendedProps,
          title: clickInfo.event.title,
          facilityName: facilityResponse.data.name,
          memberName: `${memberResponse.data.firstName} ${memberResponse.data.lastName}`,
          startTime: clickInfo.event.start,
          endTime: clickInfo.event.end
        });
        setIsModalOpen(true);
      } else {
        console.error('Error fetching details:', facilityResponse.error || memberResponse.error);
      }
    } else if (eventType === 'instructorSchedule') {
      const facilityId = clickInfo.event.extendedProps.facilityId;
      const instructorId = clickInfo.event.extendedProps.instructorId;
      const [facilityResponse, instructorResponse] = await Promise.all([
        FacilityService.getFacilityById(facilityId),
        MemberService.getMember(instructorId)
      ]);
      if (facilityResponse.success && instructorResponse.success) {
        setSelectedEvent({
          ...clickInfo.event.extendedProps,
          facilityName: facilityResponse.data.name,
          instructorName: `${instructorResponse.data.firstName} ${instructorResponse.data.lastName}`,
          startTime: clickInfo.event.start,
          endTime: clickInfo.event.end
        });
        setIsModalOpen(true);
      } else {
        console.error('Error fetching details:', facilityResponse.error || instructorResponse.error);
      }
    }
  };

  const handleCreateBooking = () => {
    if (user && (user.role === 'USER' || user.role === 'INSTRUCTOR' || user.role === 'ADMIN')) {
      setSelectedEvent({
        type: 'booking',
        title: '',
        facilityId: '',
        memberId: user.id, // Automatically set the memberId
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour from now
      });
      setIsCreating(true);
      setIsModalOpen(true);
    } else {
      alert('Du måste vara inloggad som medlem, instruktör eller administratör för att skapa en bokning.');
    }
  };

  const handleCreateOpeningHours = () => {
    if (user && user.role === 'ADMIN') {
      setSelectedEvent({
        type: 'openingHours',
        title: 'Nya öppettider',
        openingTime: new Date(),
        closingTime: new Date(new Date().getTime() + 8 * 60 * 60 * 1000), // 8 hours from now
      });
      setIsCreating(true);
      setIsModalOpen(true);
    } else {
      alert('Du måste vara inloggad som administratör för att skapa öppettider.');
    }
  };

  const handleCreateInstructorSchedule = () => {
    setSelectedEvent({
      type: 'instructorSchedule',
      instructorId: '',
      facilityId: '',
      startTime: '',
      endTime: ''
    });
    setIsCreating(true);
    setIsModalOpen(true);
  };

  const handleEventUpdate = async (updatedEvent) => {
    if (updatedEvent.type === 'booking' && user.role === 'ADMIN') {
      const response = await BookingService.updateBooking(updatedEvent.id, updatedEvent, user.token);
      if (response.success) {
        setEvents(prevEvents => prevEvents.map(event => 
          event.id === updatedEvent.id ? { ...event, ...response.data } : event
        ));
        setIsModalOpen(false);
      } else {
        console.error('Error updating booking:', response.error);
        alert(`Error updating booking: ${response.error}`);
      }
    } else {
      // Handle other event types if necessary
      setEvents(prevEvents => prevEvents.map(event => 
        event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
      ));
      setIsModalOpen(false);
    }
    await fetchAllEvents(); // Refresh all events
  };

  const handleEventCreate = async (newEvent) => {
    try {
      const response = await BookingService.createBooking(newEvent);
      if (response.success) {
        await fetchAllEvents(); // Refresh all events
        setIsModalOpen(false);
        setIsCreating(false);
      } else {
        console.error('Error creating booking:', response.error);
        console.error('Error details:', response.details);
        alert(`Error creating booking: ${response.error}`);
      }
    } catch (error) {
      console.error('Unexpected error creating booking:', error);
      alert('An unexpected error occurred while creating the booking.');
    }
  };

  const handleEventDelete = async (eventToDelete) => {
    try {
      let response;
      switch (eventToDelete.type) {
        case 'booking':
          response = await BookingService.deleteBooking(eventToDelete.id, user.token);
          break;
        case 'openingHours':
          response = await OpeningHoursService.deleteOpeningHours(eventToDelete.id);
          break;
        case 'instructorSchedule':
          response = await InstructorScheduleService.deleteSchedule(eventToDelete.id);
          break;
        default:
          throw new Error('Invalid event type');
      }

      if (response.success) {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventToDelete.id));
        alert('Event deleted successfully');
      } else {
        alert(`Error deleting event: ${response.error}`);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('An unexpected error occurred while deleting the event.');
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', padding: 2 }}>
      <Typography variant="h2" gutterBottom>Kalender</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button onClick={handleCreateBooking} variant="contained" color="primary">Skapa bokning</Button>
        {user && user.role === 'ADMIN' && (
          <>
            <Button onClick={handleCreateOpeningHours} variant="contained" color="primary">Skapa öppettider</Button>
            <Button onClick={handleCreateInstructorSchedule} variant="contained" color="primary">Skapa instruktörsschema</Button>
          </>
        )}
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={isMobile ? "timeGridDay" : "dayGridMonth"}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: isMobile ? 'timeGridDay,dayGridMonth' : 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          locale={svLocale}
          height="100%"
          eventContent={(eventInfo) => (
            <Box>
              <Typography variant="body2" fontWeight="bold">{eventInfo.timeText}</Typography>
              <Typography variant="body2">{eventInfo.event.title}</Typography>
              {(eventInfo.event.extendedProps.type === 'instructorSchedule' || eventInfo.event.extendedProps.type === 'booking') && (
                <Typography variant="body2">Anläggning: {eventInfo.event.extendedProps.facilityName}</Typography>
              )}
            </Box>
          )}
          eventDisplay="block"
          eventClick={handleEventClick}
        />
      </Box>
      <EventDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsCreating(false);
        }}
        event={selectedEvent}
        onEventUpdate={handleEventUpdate}
        onEventCreate={handleEventCreate}
        onEventDelete={handleEventDelete}
        isCreating={isCreating}
        userRole={user ? user.role : null}
        isAuthenticated={!!user}
        user={user} // Make sure this includes the token
      />
    </Box>
  );
};

export default Calendar;
