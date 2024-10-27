import React, { useState, useEffect, useContext, useRef } from 'react';
import { Box, Typography, useMediaQuery, useTheme, Button, Menu, MenuItem } from '@mui/material';
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
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const Calendar = () => {
  const [events, setEvents] = useState([]);
  const { user, getToken } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
        title: booking.title,
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
        title: `Öppettider: ${facilityResponse.data.name}`, // Remove any ID from the title
        start: oh.openingTime,
        end: oh.closingTime,
        backgroundColor: 'rgba(212, 161, 94, 0.2)',
        borderColor: '#D4A15E',
        textColor: '#5D6651',
        extendedProps: { 
          type: 'openingHours', 
          ...oh,
          facilityName: facilityResponse.data.name,
          actualId: oh.id
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
          title: `Öppettider: ${facilityResponse.data.name}`, // Ensure clean title here
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
    const token = getToken();
    let response;

    try {
      if (updatedEvent.type === 'booking' && updatedEvent.title.startsWith('Bokning: ')) {
        updatedEvent.title = updatedEvent.title.replace('Bokning: ', '');
      }
      if (updatedEvent.type === 'booking') {
        response = await BookingService.updateBooking(updatedEvent.id, updatedEvent, token);
      } else if (updatedEvent.type === 'openingHours') {
        response = await OpeningHoursService.updateOpeningHours(updatedEvent.id, updatedEvent, token);
      } else if (updatedEvent.type === 'instructorSchedule') {
        response = await InstructorScheduleService.updateSchedule(updatedEvent.id, updatedEvent, token);
      }

      if (response.success) {
        setEvents(prevEvents => prevEvents.map(event => 
          event.id === updatedEvent.id ? { ...event, ...response.data } : event
        ));
        setIsModalOpen(false);
      } else {
        setErrorMessage(response.error || 'Ett oväntat fel inträffade vid uppdatering av eventet.');
        setIsErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      setErrorMessage('Ett oväntat fel inträffade. Vänligen försök igen.');
      setIsErrorDialogOpen(true);
    }

    await fetchAllEvents(); // Refresh all events
  };

  const handleEventCreate = async (newEvent) => {
    try {
      const token = getToken();
      let response;
      if (newEvent.type === 'booking') {
        response = await BookingService.createBooking(newEvent, token);
      } else if (newEvent.type === 'openingHours') {
        response = await OpeningHoursService.createOpeningHours(newEvent, token);
      } else if (newEvent.type === 'instructorSchedule') {
        response = await InstructorScheduleService.createSchedule(newEvent, token);
      }

      if (response.success) {
        await fetchAllEvents(); // Refresh all events
        setIsModalOpen(false);
        setIsCreating(false);
      } else {
        setErrorMessage(response.error || 'Ett ovntat fel inträffade vid skapande av eventet.');
        setIsErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('Unexpected error creating event:', error);
      setErrorMessage('Ett oväntat fel inträffade. Vänligen försök igen.');
      setIsErrorDialogOpen(true);
    }
  };

  const handleEventDelete = async (deletedEvent) => {
    try {
      // Remove the deleted event from the state
      setEvents(prevEvents => prevEvents.filter(event => event.id !== deletedEvent.id));

      // Refresh all events
      await fetchAllEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Ett fel uppstod vid borttagning av eventet. Vänligen försök igen.');
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDatesSet = (dateInfo) => {
    setCurrentDate(dateInfo.view.currentStart);
  };

  const handleErrorDialogClose = () => {
    setIsErrorDialogOpen(false);
    setErrorMessage('');
  };

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', padding: { xs: 1, sm: 2 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ display: { xs: 'none', sm: 'block' } }}>Kalender</Typography>
        <Typography variant="h6">{currentDate.toLocaleString('sv-SE', { month: 'long', year: 'numeric' })}</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" size="small" onClick={() => calendarRef.current.getApi().prev()}>
            <ArrowBackIcon fontSize="small" />
          </Button>
          <Button variant="outlined" size="small" onClick={() => calendarRef.current.getApi().next()}>
            <ArrowForwardIcon fontSize="small" />
          </Button>
          <Button variant="outlined" size="small" onClick={() => calendarRef.current.getApi().today()}>
            Idag
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button variant="outlined" size="small" onClick={() => calendarRef.current.getApi().changeView('dayGridMonth')}>M</Button>
          <Button variant="outlined" size="small" onClick={() => calendarRef.current.getApi().changeView('timeGridWeek')}>V</Button>
          <Button variant="outlined" size="small" onClick={() => calendarRef.current.getApi().changeView('timeGridDay')}>D</Button>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={isMobile ? "timeGridDay" : "dayGridMonth"}
          headerToolbar={false}
          events={events}
          locale={svLocale}
          height="100%"
          eventContent={(eventInfo) => (
            <Box sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }, lineHeight: 1.2 }}>
              <Typography variant="body2" fontWeight="bold" noWrap>{eventInfo.timeText}</Typography>
              <Typography variant="body2" noWrap>{eventInfo.event.title}</Typography>
              {(eventInfo.event.extendedProps.type === 'instructorSchedule' || eventInfo.event.extendedProps.type === 'booking') && (
                <Typography variant="body2" noWrap>Anl: {eventInfo.event.extendedProps.facilityName}</Typography>
              )}
            </Box>
          )}
          eventDisplay="block"
          eventClick={handleEventClick}
          dayMaxEvents={isMobile ? 2 : 3}
          views={{
            dayGridMonth: {
              dayMaxEvents: 2,
            },
            timeGrid: {
              dayMaxEvents: 3,
            },
          }}
          datesSet={handleDatesSet}
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
      />
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={handleMenuOpen}
        startIcon={<AddIcon />}
      >
        Skapa
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleCreateBooking(); handleMenuClose(); }}>Bokning</MenuItem>
        {user && user.role === 'ADMIN' && [
          <MenuItem key="openingHours" onClick={() => { handleCreateOpeningHours(); handleMenuClose(); }}>Öppettider</MenuItem>,
          <MenuItem key="instructorSchedule" onClick={() => { handleCreateInstructorSchedule(); handleMenuClose(); }}>Instruktörsschema</MenuItem>
        ]}
      </Menu>
      <Dialog
        open={isErrorDialogOpen}
        onClose={handleErrorDialogClose}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">{"Fel vid skapande av bokning"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-description">
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogClose} color="primary">
            Stäng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;
