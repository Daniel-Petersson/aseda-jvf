import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
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

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    try {
      const [bookingsResponse, openingHoursResponse, instructorSchedulesResponse] = await Promise.all([
        BookingService.getAllBookings(),
        OpeningHoursService.getAllOpeningHours(),
        InstructorScheduleService.getAllSchedules()
      ]);

      const formattedBookings = await formatBookings(bookingsResponse);
      const formattedOpeningHours = await formatOpeningHours(openingHoursResponse.data);
      const formattedInstructorSchedules = await formatInstructorSchedules(instructorSchedulesResponse.data);

      const formattedEvents = [
        ...formattedBookings,
        ...formattedOpeningHours,
        ...formattedInstructorSchedules
      ];

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
        title: `Bokning: ${booking.id}`,
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

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', padding: 2 }}>
      <Typography variant="h2" gutterBottom>Kalender</Typography>
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
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
      />
    </Box>
  );
};

export default Calendar;
