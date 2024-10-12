import React, { useState, useEffect, useContext } from 'react';
import { useCookies } from 'react-cookie';
import { Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, useMediaQuery, Snackbar, Alert, DialogContentText, InputLabel, FormControl, FormControlLabel, Checkbox } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTheme } from '@mui/material/styles';
import BookingService from '../services/BookingService';
import { Grid } from '@mui/material';
import { AuthContext } from '../utils/AuthContext';
import { createOpeningHours, getAllOpeningHours, updateOpeningHours, deleteOpeningHours } from '../services/OpeningHoursService';
import { getAllFacilities } from '../services/FacilityService';
import { getAllMembers } from '../services/MemberService';
import { createAvailability, updateAvailability, deleteAvailability, getAvailabilityByFacility } from '../services/FacilityAvailabilityService';
import { createSchedule, updateSchedule, deleteSchedule, getAllSchedules } from '../services/InstructorScheduleService';

const MyCalendar = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [events, setEvents] = useState([]);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [openingHoursDialogOpen, setOpeningHoursDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState({ title: '', startTime: '', endTime: '', facilityId: '' });
  const [selectedOpeningHours, setSelectedOpeningHours] = useState({ facilityId: '', openingTime: '', closingTime: '', assignedLeaderId: '' });
  const [facilities, setFacilities] = useState([]);
  const [members, setMembers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const { user } = useContext(AuthContext);
  const isAdmin = user && user.role === 'ADMIN';
  const isAuthenticated = !!user;
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [cookies] = useCookies(['token']);
  const [facilityAvailabilityDialogOpen, setFacilityAvailabilityDialogOpen] = useState(false);
  const [selectedFacilityAvailability, setSelectedFacilityAvailability] = useState({ facilityId: '', startTime: '', endTime: '', seasonal: false });
  const [instructorScheduleDialogOpen, setInstructorScheduleDialogOpen] = useState(false);
  const [selectedInstructorSchedule, setSelectedInstructorSchedule] = useState({ instructorId: '', facilityId: '', startTime: '', endTime: '' });
  useEffect(() => {
    fetchBookings();
    fetchFacilities();
    fetchOpeningHours();
    fetchMembers();
    fetchFacilityAvailability();
    fetchInstructorSchedules();
  }, []);


  const fetchBookings = async () => {
    try {
      const bookings = await BookingService.getAllBookings();
      const formattedBookings = bookings.map(booking => ({
        id: booking.id,
        title: booking.title,
        start: booking.startTime,
        end: booking.endTime,
        type: 'booking',
        extendedProps: {
          type: 'booking',
          facilityName: facilities.find(f => f.id === booking.facilityId)?.name || 'Okänd anläggning'
        }
      }));
      setEvents(prevEvents => [...prevEvents.filter(e => e.type !== 'booking'), ...formattedBookings]);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const fetchOpeningHours = async () => {
    try {
      const response = await getAllOpeningHours();
      if (response.success) {
        const formattedOpeningHours = response.data.map(oh => {
          const facility = facilities.find(f => f.id === oh.facilityId);
          return {
            id: oh.id,
            title: 'Öppet',
            start: oh.openingTime,
            end: oh.closingTime,
            type: 'openingHours',
            extendedProps: {
              type: 'openingHours',
              facilityName: facility ? facility.name : 'Okänd anläggning'
            }
          };
        });
        setEvents(prevEvents => [...prevEvents.filter(e => e.type !== 'openingHours'), ...formattedOpeningHours]);
      } else {
        console.error('Failed to fetch opening hours:', response.error);
      }
    } catch (error) {
      console.error('Failed to fetch opening hours:', error);
    }
  };

  const fetchFacilities = async () => {
    try {
      const response = await getAllFacilities();
      if (response.success) {
        setFacilities(response.data);
      } else {
        console.error('Failed to fetch facilities:', response.error);
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await getAllMembers();
      if (response.success) {
        setMembers(response.data);
      } else {
        console.error('Failed to fetch members:', response.error);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchFacilityAvailability = async () => {
    try {
      const response = await getAvailabilityByFacility();
      if (response.success) {
        const formattedAvailability = response.data.map(fa => ({
          id: fa.availabilityId,
          title: 'Tillgänglig',
          start: fa.startTime,
          end: fa.endTime,
          type: 'facilityAvailability',
          seasonal: fa.seasonal
        }));
        setEvents(prevEvents => [...prevEvents.filter(e => e.type !== 'facilityAvailability'), ...formattedAvailability]);
      } else {
        console.error('Failed to fetch facility availability:', response.error);
      }
    } catch (error) {
      console.error('Failed to fetch facility availability:', error);
    }
  };

  const fetchInstructorSchedules = async () => {
    try {
      const response = await getAllSchedules();
      if (response.success) {
        const formattedSchedules = await Promise.all(response.data.map(async schedule => {
          const instructor = members.find(m => m.id === schedule.instructorId);
          const facility = facilities.find(f => f.id === schedule.facilityId);
          return {
            id: schedule.id,
            title: `Skjutledare: ${instructor ? `${instructor.firstName} ${instructor.lastName}` : 'Okänd'} - ${facility ? facility.name : 'Okänd anläggning'}`,
            start: schedule.startTime,
            end: schedule.endTime,
            type: 'instructorSchedule',
            extendedProps: {
              instructorId: schedule.instructorId,
              facilityId: schedule.facilityId,
              instructorName: instructor ? `${instructor.firstName} ${instructor.lastName}` : 'Okänd',
              facilityName: facility ? facility.name : 'Okänd anläggning'
            }
          };
        }));
        setEvents(prevEvents => [...prevEvents.filter(e => e.type !== 'instructorSchedule'), ...formattedSchedules]);
      } else {
        console.error('Failed to fetch instructor schedules:', response.error);
      }
    } catch (error) {
      console.error('Failed to fetch instructor schedules:', error);
    }
  };

  const handleEventClick = async (info) => {
    if (info.event.extendedProps.type === 'booking') {
      try {
        const booking = await BookingService.getBooking(info.event.id);
        setSelectedBooking(booking);
        setBookingDialogOpen(true);
      } catch (error) {
        console.error('Failed to fetch booking details:', error);
      }
    } else if (isAdmin) {
      if (info.event.extendedProps.type === 'openingHours') {
        try {
          const openingHours = await getAllOpeningHours(info.event.id);
          if (openingHours.success) {
            setSelectedOpeningHours(openingHours.data);
            setOpeningHoursDialogOpen(true);
          }
        } catch (error) {
          console.error('Failed to fetch opening hours details:', error);
        }
      } else if (info.event.extendedProps.type === 'facilityAvailability') {
        setSelectedFacilityAvailability({
          id: info.event.id,
          facilityId: info.event.extendedProps.facilityId,
          startTime: info.event.start,
          endTime: info.event.end,
          seasonal: info.event.extendedProps.seasonal
        });
        setFacilityAvailabilityDialogOpen(true);
      } else if (info.event.extendedProps.type === 'instructorSchedule') {
        setSelectedInstructorSchedule({
          id: info.event.id,
          instructorId: info.event.extendedProps.instructorId,
          facilityId: info.event.extendedProps.facilityId,
          startTime: info.event.start,
          endTime: info.event.end
        });
        setInstructorScheduleDialogOpen(true);
      }
    } else {
      showSnackbar('Du har inte behörighet att hantera öppettider eller tillgänglighet.', 'warning');
    }
  };

  const handleNewBooking = () => {
    if (!isAuthenticated) {
      showSnackbar('Du måste vara inloggad för att boka.', 'warning');
      return;
    }
    setSelectedBooking({ title: '', startTime: '', endTime: '', facilityId: '' });
    setBookingDialogOpen(true);
  };

  const handleNewOpeningHours = () => {
    setSelectedOpeningHours({ facilityId: '', openingTime: '', closingTime: '', assignedLeaderId: '' });
    setOpeningHoursDialogOpen(true);
  };

  const handleNewFacilityAvailability = () => {
    setSelectedFacilityAvailability({ facilityId: '', startTime: '', endTime: '', seasonal: false });
    setFacilityAvailabilityDialogOpen(true);
  };

  const handleSaveBooking = () => {
    setConfirmAction('saveBooking');
    setConfirmDialogOpen(true);
  };

  const confirmSaveBooking = async () => {
    try {
      const bookingData = {
        title: selectedBooking.title,
        facilityId: selectedBooking.facilityId,
        memberId: user.memberId,
        startTime: selectedBooking.startTime,
        endTime: selectedBooking.endTime
      };

      let result;
      if (selectedBooking.id) {
        result = await BookingService.updateBooking(selectedBooking.id, bookingData, cookies.token);
      } else {
        result = await BookingService.createBooking(bookingData);
      }

      if (result.success) {
        setBookingDialogOpen(false);
        fetchBookings();
        showSnackbar('Bokning sparad framgångsrikt!', 'success');
      } else {
        let errorMessage = result.error;
        if (result.status === 400) {
          errorMessage = 'Anläggningen är inte tillgänglig för den begärda tidsluckan.';
        } else if (result.status === 401) {
          errorMessage = 'Du har inte behörighet att göra denna bokning.';
        } else if (result.status === 409) {
          errorMessage = 'Det finns en konflikt med en befintlig bokning.';
        }
        showSnackbar(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Failed to save booking:', error);
      showSnackbar('Ett oväntat fel inträffade. Vänligen försök igen.', 'error');
    }
    setConfirmDialogOpen(false);
  };

  const handleDeleteBooking = () => {
    setConfirmAction('deleteBooking');
    setConfirmDialogOpen(true);
  };

  const confirmDeleteBooking = async () => {
    try {
      await BookingService.deleteBooking(selectedBooking.id, cookies.token);
      setBookingDialogOpen(false);
      fetchBookings();
      showSnackbar('Bokningen togs bort framgångsrikt!', 'success');
    } catch (error) {
      console.error('Failed to delete booking:', error);
      showSnackbar('Misslyckades med att ta bort bokningen.', 'error');
    }
    setConfirmDialogOpen(false);
  };

  const handleSaveOpeningHours = () => {
    setConfirmAction('saveOpeningHours');
    setConfirmDialogOpen(true);
  };

  const confirmSaveOpeningHours = async () => {
    try {
      let response;
      if (selectedOpeningHours.id) {
        response = await updateOpeningHours(selectedOpeningHours.id, selectedOpeningHours);
      } else {
        response = await createOpeningHours(selectedOpeningHours);
      }
      if (response.success) {
        setOpeningHoursDialogOpen(false);
        fetchOpeningHours();
        showSnackbar('Öppettider sparade framgångsrikt!', 'success');
      } else {
        showSnackbar(response.error || 'Misslyckades med att spara öppettider.', 'error');
      }
    } catch (error) {
      console.error('Failed to save opening hours:', error);
      showSnackbar('Misslyckades med att spara öppettider.', 'error');
    }
    setConfirmDialogOpen(false);
  };

  const handleDeleteOpeningHours = () => {
    setConfirmAction('deleteOpeningHours');
    setConfirmDialogOpen(true);
  };

  const confirmDeleteOpeningHours = async () => {
    try {
      await deleteOpeningHours(selectedOpeningHours.id);
      setOpeningHoursDialogOpen(false);
      fetchOpeningHours();
      showSnackbar('Öppettider togs bort framgångsrikt!', 'success');
    } catch (error) {
      console.error('Failed to delete opening hours:', error);
      showSnackbar('Misslyckades med att ta bort öppettider.', 'error');
    }
    setConfirmDialogOpen(false);
  };

  const handleSaveFacilityAvailability = () => {
    setConfirmAction('saveFacilityAvailability');
    setConfirmDialogOpen(true);
  };

  const confirmSaveFacilityAvailability = async () => {
    try {
      let response;
      if (selectedFacilityAvailability.id) {
        response = await updateAvailability(selectedFacilityAvailability.id, selectedFacilityAvailability);
      } else {
        response = await createAvailability(selectedFacilityAvailability);
      }
      if (response.success) {
        setFacilityAvailabilityDialogOpen(false);
        fetchFacilityAvailability();
        showSnackbar('Tillgänglighet sparad framgångsrikt!', 'success');
      } else {
        showSnackbar(response.error || 'Misslyckades med att spara tillgänglighet.', 'error');
      }
    } catch (error) {
      console.error('Failed to save facility availability:', error);
      showSnackbar('Misslyckades med att spara tillgänglighet.', 'error');
    }
    setConfirmDialogOpen(false);
  };

  const handleDeleteFacilityAvailability = () => {
    setConfirmAction('deleteFacilityAvailability');
    setConfirmDialogOpen(true);
  };

  const confirmDeleteFacilityAvailability = async () => {
    try {
      await deleteAvailability(selectedFacilityAvailability.id);
      setFacilityAvailabilityDialogOpen(false);
      fetchFacilityAvailability();
      showSnackbar('Tillgänglighet togs bort framgångsrikt!', 'success');
    } catch (error) {
      console.error('Failed to delete facility availability:', error);
      showSnackbar('Misslyckades med att ta bort tillgänglighet.', 'error');
    }
    setConfirmDialogOpen(false);
  };

  const handleSaveInstructorSchedule = () => {
    setConfirmAction('saveInstructorSchedule');
    setConfirmDialogOpen(true);
  };

  const confirmSaveInstructorSchedule = async () => {
    try {
      const response = selectedInstructorSchedule.id
        ? await updateSchedule(selectedInstructorSchedule.id, selectedInstructorSchedule)
        : await createSchedule(selectedInstructorSchedule);

      if (response.success) {
        setInstructorScheduleDialogOpen(false);
        fetchInstructorSchedules();
        showSnackbar('Instruktörschema sparades framgångsrikt!', 'success');
      } else {
        const errorMessage = response.error || 'Misslyckades med att spara instruktörschema.'
        const detailedError = response.details ? `\n\nDetaljer: ${JSON.stringify(response.details)}` : ''
        showSnackbar(`${errorMessage}${detailedError}`, 'error');
      }
    } catch (error) {
      showSnackbar('Ett oväntat fel inträffade. Vänligen försök igen.', 'error');
    }
    setConfirmDialogOpen(false);
  };

  const handleDeleteInstructorSchedule = () => {
    setConfirmAction('deleteInstructorSchedule');
    setConfirmDialogOpen(true);
  };

  const confirmDeleteInstructorSchedule = async () => {
    try {
      await deleteSchedule(selectedInstructorSchedule.id);
      setInstructorScheduleDialogOpen(false);
      fetchInstructorSchedules();
      showSnackbar('Instruktörschema togs bort framgångsrikt!', 'success');
    } catch (error) {
      console.error('Failed to delete instructor schedule:', error);
      showSnackbar('Misslyckades med att ta bort instruktörschema.', 'error');
    }
    setConfirmDialogOpen(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message.split('\n'));
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={isSmallScreen ? 12 : 8}>
        <Paper elevation={3} sx={{ padding: 2, margin: isSmallScreen ? '10px' : '20px' }}>
          <Typography variant="h2" gutterBottom>Kalender</Typography>
          <Button variant="contained" color="primary" onClick={handleNewBooking} style={{ marginBottom: '20px', marginRight: '10px' }}>
            Ny Bokning
          </Button>
          {isAdmin && (
            <>
              <Button variant="contained" color="primary" onClick={handleNewOpeningHours} style={{ marginBottom: '20px', marginRight: '10px' }}>
                Nya Öppettider
              </Button>
              <Button variant="contained" color="primary" onClick={handleNewFacilityAvailability} style={{ marginBottom: '20px',marginRight: '10px' }}>
                Ny Tillgänglighet
              </Button>
              <Button variant="contained" color="primary" onClick={() => setInstructorScheduleDialogOpen(true)} style={{ marginBottom: '20px' }}>
                Nytt Instruktörschema
              </Button>
            </>
          )}
          <div style={{ color: '#5D6651' }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              locale="sv"
              firstDay={1}
              events={events}
              eventClick={handleEventClick}
              eventContent={(eventInfo) => {
                let backgroundColor;
                let textColor = 'white';
                let title = eventInfo.event.title;

                switch (eventInfo.event.extendedProps.type) {
                  case 'openingHours':
                    backgroundColor = '#4CAF50';
                    title = `Öppet: ${eventInfo.event.extendedProps.facilityName}`;
                    break;
                  case 'facilityAvailability':
                    backgroundColor = '#FFA500';
                    break;
                  case 'instructorSchedule':
                    backgroundColor = '#9C27B0';
                    title = `Skjutledare: ${eventInfo.event.extendedProps.instructorName} - ${eventInfo.event.extendedProps.facilityName}`;
                    break;
                  case 'booking':
                    backgroundColor = '#3788d8';
                    title = `Bokning: ${eventInfo.event.title} - ${eventInfo.event.extendedProps.facilityName}`;
                    break;
                  default:
                    backgroundColor = '#3788d8';
                }

                return (
                  <div style={{
                    backgroundColor,
                    color: textColor,
                    padding: '2px',
                    borderRadius: '3px',
                    fontSize: '0.8em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {title}
                  </div>
                )
              }}
              buttonText={{
                today: 'Idag',
                month: 'Månad',
                week: 'Vecka',
                day: 'Dag'
              }}
              slotMinTime="06:00:00"
              slotMaxTime="23:00:00"
            />
          </div>

          {/* Booking Dialog */}
          <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)}>
            <DialogTitle>{selectedBooking?.id ? 'Redigera bokning' : 'Ny bokning'}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Titel"
                type="text"
                fullWidth
                value={selectedBooking?.title || ''}
                onChange={(e) => setSelectedBooking({ ...selectedBooking, title: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Start Time"
                type="datetime-local"
                fullWidth
                value={selectedBooking?.startTime || ''}
                onChange={(e) => setSelectedBooking({ ...selectedBooking, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                label="End Time"
                type="datetime-local"
                fullWidth
                value={selectedBooking?.endTime || ''}
                onChange={(e) => setSelectedBooking({ ...selectedBooking, endTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Anläggning</InputLabel>
                <Select
                  value={selectedBooking?.facilityId || ''}
                  onChange={(e) => setSelectedBooking({ ...selectedBooking, facilityId: e.target.value })}
                >
                  {facilities.map(facility => (
                    <MenuItem key={facility.id} value={facility.id}>{facility.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setBookingDialogOpen(false)} color="primary">Avbryt</Button>
              {selectedBooking?.id && <Button onClick={handleDeleteBooking} color="secondary">Ta bort</Button>}
              <Button onClick={handleSaveBooking} color="primary">Spara</Button>
            </DialogActions>
          </Dialog>

          {isAdmin && (
            <>
              {/* Opening Hours Dialog */}
              <Dialog open={openingHoursDialogOpen} onClose={() => setOpeningHoursDialogOpen(false)}>
                <DialogTitle>{selectedOpeningHours?.id ? 'Redigera Öppettider' : 'Nya Öppettider'}</DialogTitle>
                <DialogContent>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Anläggning</InputLabel>
                    <Select
                      value={selectedOpeningHours.facilityId}
                      onChange={(e) => setSelectedOpeningHours({ ...selectedOpeningHours, facilityId: e.target.value })}
                    >
                      {facilities.map((facility) => (
                        <MenuItem key={facility.id} value={facility.id}>{facility.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    margin="dense"
                    label="Öppningstid"
                    type="datetime-local"
                    fullWidth
                    value={selectedOpeningHours.openingTime}
                    onChange={(e) => setSelectedOpeningHours({ ...selectedOpeningHours, openingTime: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    margin="dense"
                    label="Stängningstid"
                    type="datetime-local"
                    fullWidth
                    value={selectedOpeningHours.closingTime}
                    onChange={(e) => setSelectedOpeningHours({ ...selectedOpeningHours, closingTime: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Ansvarig Ledare</InputLabel>
                    <Select
                      value={selectedOpeningHours.assignedLeaderId}
                      onChange={(e) => setSelectedOpeningHours({ ...selectedOpeningHours, assignedLeaderId: e.target.value })}
                    >
                      {members
                        .filter(member => member.role === 'ADMIN' || member.role === 'INSTRUCTOR')
                        .map(member => (
                          <MenuItem key={member.id} value={member.id}>
                            {member.firstName} {member.lastName} ({member.role})
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpeningHoursDialogOpen(false)} color="primary">Avbryt</Button>
                  {selectedOpeningHours?.id && <Button onClick={handleDeleteOpeningHours} color="secondary">Ta bort</Button>}
                  <Button onClick={handleSaveOpeningHours} color="primary">Spara</Button>
                </DialogActions>
              </Dialog>

              {/* Facility Availability Dialog */}
              <Dialog open={facilityAvailabilityDialogOpen} onClose={() => setFacilityAvailabilityDialogOpen(false)}>
                <DialogTitle>{selectedFacilityAvailability?.id ? 'Redigera Tillgänglighet' : 'Ny Tillgänglighet'}</DialogTitle>
                <DialogContent>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Anläggning</InputLabel>
                    <Select
                      value={selectedFacilityAvailability.facilityId}
                      onChange={(e) => setSelectedFacilityAvailability({ ...selectedFacilityAvailability, facilityId: e.target.value })}
                    >
                      {facilities.map((facility) => (
                        <MenuItem key={facility.id} value={facility.id}>{facility.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    margin="dense"
                    label="Starttid"
                    type="datetime-local"
                    fullWidth
                    value={selectedFacilityAvailability.startTime}
                    onChange={(e) => setSelectedFacilityAvailability({ ...selectedFacilityAvailability, startTime: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    margin="dense"
                    label="Sluttid"
                    type="datetime-local"
                    fullWidth
                    value={selectedFacilityAvailability.endTime}
                    onChange={(e) => setSelectedFacilityAvailability({ ...selectedFacilityAvailability, endTime: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedFacilityAvailability.seasonal}
                        onChange={(e) => setSelectedFacilityAvailability({ ...selectedFacilityAvailability, seasonal: e.target.checked })}
                      />
                    }
                    label="Säsongsbaserad"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setFacilityAvailabilityDialogOpen(false)} color="primary">Avbryt</Button>
                  {selectedFacilityAvailability?.id && <Button onClick={handleDeleteFacilityAvailability} color="secondary">Ta bort</Button>}
                  <Button onClick={handleSaveFacilityAvailability} color="primary">Spara</Button>
                </DialogActions>
              </Dialog>

              {/* Instructor Schedule Dialog */}
              <Dialog open={instructorScheduleDialogOpen} onClose={() => setInstructorScheduleDialogOpen(false)}>
                <DialogTitle>{selectedInstructorSchedule?.id ? 'Redigera Instruktörschema' : 'Nytt Instruktörschema'}</DialogTitle>
                <DialogContent>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Instruktör</InputLabel>
                    <Select
                      value={selectedInstructorSchedule.instructorId}
                      onChange={(e) => setSelectedInstructorSchedule({ ...selectedInstructorSchedule, instructorId: e.target.value })}
                    >
                      {members
                        .filter(member => member.role === 'INSTRUCTOR')
                        .map(instructor => (
                          <MenuItem key={instructor.id} value={instructor.id}>{instructor.firstName} {instructor.lastName}</MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Anläggning</InputLabel>
                    <Select
                      value={selectedInstructorSchedule.facilityId}
                      onChange={(e) => setSelectedInstructorSchedule({ ...selectedInstructorSchedule, facilityId: e.target.value })}
                    >
                      {facilities.map((facility) => (
                        <MenuItem key={facility.id} value={facility.id}>{facility.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    margin="dense"
                    label="Starttid"
                    type="datetime-local"
                    fullWidth
                    value={selectedInstructorSchedule.startTime}
                    onChange={(e) => setSelectedInstructorSchedule({ ...selectedInstructorSchedule, startTime: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    margin="dense"
                    label="Sluttid"
                    type="datetime-local"
                    fullWidth
                    value={selectedInstructorSchedule.endTime}
                    onChange={(e) => setSelectedInstructorSchedule({ ...selectedInstructorSchedule, endTime: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setInstructorScheduleDialogOpen(false)} color="primary">Avbryt</Button>
                  {selectedInstructorSchedule?.id && <Button onClick={handleDeleteInstructorSchedule} color="secondary">Ta bort</Button>}
                  <Button onClick={handleSaveInstructorSchedule} color="primary">Spara</Button>
                </DialogActions>
              </Dialog>
            </>
          )}

          {/* Confirmation Dialog */}
          <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
            <DialogTitle>Bekräfta åtgärd</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {confirmAction === 'saveBooking' && 'Är du säker på att du vill spara denna bokning?'}
                {confirmAction === 'deleteBooking' && 'Är du säker på att du vill ta bort denna bokning?'}
                {confirmAction === 'saveOpeningHours' && 'Är du säker på att du vill spara dessa öppettider?'}
                {confirmAction === 'deleteOpeningHours' && 'Är du säker på att du vill ta bort dessa öppettider?'}
                {confirmAction === 'saveFacilityAvailability' && 'Är du säker på att du vill spara denna tillgänglighet?'}
                {confirmAction === 'deleteFacilityAvailability' && 'Är du säker på att du vill ta bort denna tillgänglighet?'}
                {confirmAction === 'saveInstructorSchedule' && 'Är du säker på att du vill spara detta instruktörschema?'}
                {confirmAction === 'deleteInstructorSchedule' && 'Är du säker på att du vill ta bort detta instruktörschema?'}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDialogOpen(false)} color="primary">Avbryt</Button>
              <Button 
                onClick={() => {
                  switch (confirmAction) {
                    case 'saveBooking': confirmSaveBooking(); break;
                    case 'deleteBooking': confirmDeleteBooking(); break;
                    case 'saveOpeningHours': confirmSaveOpeningHours(); break;
                    case 'deleteOpeningHours': confirmDeleteOpeningHours(); break;
                    case 'saveFacilityAvailability': confirmSaveFacilityAvailability(); break;
                    case 'deleteFacilityAvailability': confirmDeleteFacilityAvailability(); break;
                    case 'saveInstructorSchedule': confirmSaveInstructorSchedule(); break;
                    case 'deleteInstructorSchedule': confirmDeleteInstructorSchedule(); break;
                  }
                }} 
                color="primary" 
                autoFocus
              >
                Bekräfta
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
  open={snackbarOpen}
  autoHideDuration={6000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
    {Array.isArray(snackbarMessage) ? (
      snackbarMessage.map((line, index) => <div key={index}>{line}</div>)
    ) : (
      snackbarMessage
    )}
  </Alert>
</Snackbar>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MyCalendar;