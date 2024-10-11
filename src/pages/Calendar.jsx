import React, { useState, useEffect, useContext } from 'react';
import { useCookies } from 'react-cookie';
import { Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, useMediaQuery, Snackbar, Alert, DialogContentText } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTheme } from '@mui/material/styles';
import BookingService from '../services/BookingService';
import FacilityService from '../services/FacilityService';
import { Grid } from '@mui/material';
import { AuthContext } from '../utils/AuthContext';

const MyCalendar = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState({ title: '', startTime: '', endTime: '', facilityId: '' });
  const [facilities, setFacilities] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const { user } = useContext(AuthContext);
  const isAuthenticated = !!user;
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // New state to track the action
  const [cookies] = useCookies(['token']);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookings = await BookingService.getAllBookings();
        const formattedEvents = bookings.map(booking => ({
          id: booking.id,
          title: booking.title,
          start: booking.startTime,
          end: booking.endTime
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    const fetchFacilities = async () => {
      try {
        const facilities = await FacilityService.getAllFacilities();
        if (Array.isArray(facilities)) {
          setFacilities(facilities);
        } else {
          console.error('Facilities response is not an array:', facilities);
          setFacilities([]);
        }
      } catch (error) {
        console.error('Failed to fetch facilities:', error);
        setFacilities([]);
      }
    };

    fetchBookings();
    fetchFacilities();
  }, [events]);

  const handleEventClick = async (info) => {
    try {
      const booking = await BookingService.getBooking(info.event.id);
      setSelectedBooking(booking);
      setOpen(true);
    } catch (error) {
      console.error('Failed to fetch booking details:', error);
    }
  };

  const canEditOrDelete = () => {
    return selectedBooking && (selectedBooking.memberId === user.memberId || user.role === 'ADMIN');
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBooking({ title: '', startTime: '', endTime: '', facilityId: '' });
  };

  const handleSave = async () => {
    if (!canEditOrDelete()) {
      setSnackbarMessage('Du har inte behörighet att redigera denna bokning.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setConfirmAction('save');
    setConfirmDialogOpen(true);
  };

  const confirmSave = async () => {
    try {
      if (selectedBooking) {
        const bookingData = { 
          title: selectedBooking.title,
          facilityId: selectedBooking.facilityId,
          memberId: user.memberId,
          startTime: selectedBooking.startTime,
          endTime: selectedBooking.endTime
        };

        if (selectedBooking.id) {
          await BookingService.updateBooking(selectedBooking.id, bookingData, cookies.token);
        } else {
          await BookingService.createBooking(bookingData);
        }
      }
      setOpen(false);
      setConfirmDialogOpen(false);
      fetchBookings(); // Refetch bookings
    } catch (error) {
      console.error('Failed to save booking:', error);
    }
  };

  const handleDelete = async () => {
    if (!canEditOrDelete()) {
      setSnackbarMessage('Du har inte behörighet att ta bort denna bokning.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setConfirmAction('delete');
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (selectedBooking) {
        await BookingService.deleteBooking(selectedBooking.id, cookies.token);
      }
      setOpen(false);
      setSnackbarMessage('Bokningen togs bort framgångsrikt!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setConfirmDialogOpen(false);
      fetchBookings(); // Refetch bookings
    } catch (error) {
      console.error('Failed to delete booking:', error);
      setSnackbarMessage('Misslyckades med att ta bort bokningen.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleNewBooking = () => {
    if (!isAuthenticated) {
      setSnackbarMessage('Du måste vara inloggad för att boka.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    setSelectedBooking({ title: '', startTime: '', endTime: '', facilityId: '' });
    setOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={isSmallScreen ? 12 : 8}>
        <Paper elevation={3} sx={{ padding: 2, margin: isSmallScreen ? '10px' : '20px' }}>
          <Typography variant="h2" gutterBottom>Kalender</Typography>
          <Button variant="contained" color="primary" onClick={handleNewBooking} style={{ marginBottom: '20px' }}>
            Ny Bokning
          </Button>
          <div style={{ color: '#5D6651' }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={isSmallScreen ? "timeGridDay" : "dayGridMonth"}
              events={events}
              eventClick={handleEventClick}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: isSmallScreen ? 'timeGridDay' : 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              themeSystem='standard'
              eventColor={theme.palette.secondary.main}
              eventTextColor='#5D6651'
              dayHeaderFormat={{ weekday: 'short' }}
              buttonText={{
                today: 'Idag',
                month: 'Månad',
                week: 'Vecka',
                day: 'Dag'
              }}
              height="auto"
              contentHeight="auto"
              aspectRatio={isSmallScreen ? 1 : 1.35}
              titleFormat={{ year: 'numeric', month: 'long' }}
              firstDay={1}
              slotLabelFormat={{
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: true,
                meridiem: 'short'
              }}
              buttonIcons={{
                prev: 'chevron-left',
                next: 'chevron-right'
              }}
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short'
              }}
              allDayText='Heldag'
              moreLinkText='fler'
              noEventsText='Inga händelser att visa'
            />
          </div>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{selectedBooking?.id ? 'Redigera Bokning' : 'Ny Bokning'}</DialogTitle>
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
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                margin="dense"
                label="End Time"
                type="datetime-local"
                fullWidth
                value={selectedBooking?.endTime || ''}
                onChange={(e) => setSelectedBooking({ ...selectedBooking, endTime: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Select
                fullWidth
                value={selectedBooking?.facilityId || ''}
                onChange={(e) => setSelectedBooking({ ...selectedBooking, facilityId: e.target.value })}
                displayEmpty
              >
                <MenuItem value="" disabled>Välj anläggning</MenuItem>
                {facilities.map(facility => (
                  <MenuItem key={facility.id} value={facility.id}>
                    {facility.name}
                  </MenuItem>
                ))}
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Avbryt
              </Button>
              {selectedBooking?.id && (
                <Button onClick={handleDelete} color="secondary">
                  Ta bort
                </Button>
              )}
              <Button onClick={handleSave} color="primary">
                Spara
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={confirmDialogOpen}
        onClose={handleConfirmDialogClose}
      >
        <DialogTitle>Bekräfta åtgärd</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Är du säker på att du vill {confirmAction === 'save' ? 'spara' : 'ta bort'} denna bokning?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary">
            Avbryt
          </Button>
          <Button onClick={confirmAction === 'save' ? confirmSave : confirmDelete} color="primary" autoFocus>
            Bekräfta
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default MyCalendar;