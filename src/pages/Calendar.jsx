import React, { useState, useEffect, useContext } from 'react';
import { useCookies } from 'react-cookie';
import { Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, useMediaQuery, Snackbar, Alert, DialogContentText, InputLabel, FormControl } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTheme } from '@mui/material/styles';
import BookingService from '../services/BookingService';
import { Grid } from '@mui/material';
import { AuthContext } from '../utils/AuthContext';
import { createOpeningHours, getAllOpeningHours, updateOpeningHours } from '../services/OpeningHoursService';
import { getAllFacilities } from '../services/FacilityService';
import { getAllMembers } from '../services/MemberService';

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
  const isAuthenticated = !!user;
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [cookies] = useCookies(['token']);

  useEffect(() => {
    fetchBookings();
    fetchFacilities();
    fetchOpeningHours();
    fetchMembers();
  }, []);

  const fetchBookings = async () => {
    try {
      const bookings = await BookingService.getAllBookings();
      const formattedBookings = bookings.map(booking => ({
        id: booking.id,
        title: booking.title,
        start: booking.startTime,
        end: booking.endTime,
        type: 'booking'
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
          const openingTime = new Date(oh.openingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const closingTime = new Date(oh.closingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            id: oh.id,
            title: ` Öppet`,
            start: oh.openingTime,
            end: oh.closingTime,
            type: 'openingHours'
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

  const handleEventClick = async (info) => {
    if (info.event.extendedProps.type === 'booking') {
      try {
        const booking = await BookingService.getBooking(info.event.id);
        setSelectedBooking(booking);
        setBookingDialogOpen(true);
      } catch (error) {
        console.error('Failed to fetch booking details:', error);
      }
    } else if (info.event.extendedProps.type === 'openingHours') {
      try {
        const openingHours = await getAllOpeningHours(info.event.id);
        if (openingHours.success) {
          setSelectedOpeningHours(openingHours.data);
          setOpeningHoursDialogOpen(true);
        }
      } catch (error) {
        console.error('Failed to fetch opening hours details:', error);
      }
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

  const handleSaveBooking = async () => {
    try {
      const bookingData = {
        title: selectedBooking.title,
        facilityId: selectedBooking.facilityId,
        memberId: user.memberId,
        startTime: selectedBooking.startTime,
        endTime: selectedBooking.endTime
      };

      console.log('Booking Data:', bookingData);

      if (selectedBooking.id) {
        await BookingService.updateBooking(selectedBooking.id, bookingData, cookies.token);
      } else {
        await BookingService.createBooking(bookingData);
      }
      setBookingDialogOpen(false);
      fetchBookings();
      showSnackbar('Bokning sparad framgångsrikt!', 'success');
    } catch (error) {
      console.error('Failed to save booking:', error);
      showSnackbar('Misslyckades med att spara bokningen.', 'error');
    }
  };

  const handleSaveOpeningHours = async () => {
    try {
      console.log('Opening Hours Data:', selectedOpeningHours);
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
  };

  const handleDeleteBooking = async () => {
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

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
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
          <Button variant="contained" color="primary" onClick={handleNewOpeningHours} style={{ marginBottom: '20px' }}>
            Nya Öppettider
          </Button>
          <div style={{ color: '#5D6651' }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              locale="sv" // Ställer in språket till svenska
              events={events}
              eventClick={handleEventClick}
              eventContent={(eventInfo) => {
                return (
                  <div style={{
                    backgroundColor: eventInfo.event.extendedProps.type === 'openingHours' ? '#4CAF50' : '#3788d8',
                    color: 'white',
                    padding: '2px',
                    borderRadius: '3px'
                  }}>
                    <b>{eventInfo.timeText}</b>
                    <i>{eventInfo.event.title}</i>
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

          {/* Confirmation Dialog */}
          <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
            <DialogTitle>Bekräfta åtgärd</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Är du säker på att du vill {confirmAction === 'deleteBooking' ? 'ta bort denna bokning' : 'ta bort dessa öppettider'}?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDialogOpen(false)} color="primary">Avbryt</Button>
              <Button 
                onClick={confirmAction === 'deleteBooking' ? confirmDeleteBooking : confirmDeleteOpeningHours} 
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
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MyCalendar;