import React, { useState, useEffect, useContext } from 'react';
import { Modal, Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import * as OpeningHoursService from '../../services/OpeningHoursService';
import * as InstructorScheduleService from '../../services/InstructorScheduleService';
import * as FacilityService from '../../services/FacilityService';
import * as BookingService from '../../services/BookingService';
import * as MemberService from '../../services/MemberService';
import { AuthContext } from '../../utils/AuthContext';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { sv } from 'date-fns/locale';

const EventDetailsModal = ({ isOpen, onClose, event, onEventUpdate, onEventCreate, onEventDelete, isCreating }) => {
  const { user, getToken } = useContext(AuthContext);
  const [editedEvent, setEditedEvent] = useState(event);
  const [facilities, setFacilities] = useState([]);
  const [isEditing, setIsEditing] = useState(isCreating);
  const [errors, setErrors] = useState({});
  const [instructors, setInstructors] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    if (isCreating) {
      setEditedEvent({
        type: event?.type || 'booking',
        ...event
      });
    } else {
      setEditedEvent(event || null);
    }
    console.log('Updated editedEvent:', event);
    setIsEditing(isCreating);
    fetchFacilities();
    fetchInstructors();
    fetchFilteredMembers();
    fetchFilteredInstructors();
  }, [event, isCreating]);

  const fetchFacilities = async () => {
    const response = await FacilityService.getAllFacilities();
    if (response.success) {
      setFacilities(response.data);
    }
  };

  const fetchInstructors = async () => {
    const response = await InstructorScheduleService.getAllSchedules();
    if (response.success) {
      // Assuming the response data contains instructor information
      // You might need to adjust this based on the actual structure of the response
      setInstructors(response.data);
    } else {
      console.error('Error fetching instructor schedules:', response.error);
    }
  };

  const fetchFilteredMembers = async () => {
    const response = await MemberService.getAllMembers();
    if (response.success) {
      const filteredMembers = response.data.filter(member => 
        member.role === 'ADMIN' || member.role === 'INSTRUCTOR'
      );
      setFilteredMembers(filteredMembers);
    } else {
      console.error('Error fetching members:', response.error);
    }
  };

  const fetchFilteredInstructors = async () => {
    const response = await MemberService.getAllMembers();
    if (response.success) {
      const filteredInstructors = response.data.filter(member => 
        member.role === 'INSTRUCTOR'
      );
      setFilteredInstructors(filteredInstructors);
    } else {
      console.error('Error fetching instructors:', response.error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (validateForm()) {
      let response;
      const token = getToken();
      if (isCreating) {
        if (editedEvent.type === 'booking') {
          const bookingData = {
            ...editedEvent,
            memberId: user.memberId
          };
          response = await onEventCreate(bookingData);
        } else if (editedEvent.type === 'openingHours') {
          response = await onEventCreate(editedEvent);
        } else if (editedEvent.type === 'instructorSchedule') {
          response = await onEventCreate(editedEvent);
        }
      } else {
        if (editedEvent.type === 'booking') {
          response = await onEventUpdate(editedEvent);
        } else if (editedEvent.type === 'openingHours') {
          response = await OpeningHoursService.updateOpeningHours(editedEvent.id, editedEvent, token);
        } else if (editedEvent.type === 'instructorSchedule') {
          response = await InstructorScheduleService.updateSchedule(editedEvent.id, editedEvent, token);
        }
      }

      if (response.success) {
        onClose();
        setIsEditing(false);
      } else {
        setErrors({ submit: response.error });
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedEvent(event);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startTime' || name === 'endTime') {
      setEditedEvent(prev => ({ ...prev, [name]: value ? value.toISOString() : null }));
    } else {
      setEditedEvent(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};

    if (editedEvent.type === 'booking') {
      // Existing booking validation
      // ...
    } else if (editedEvent.type === 'openingHours') {
      tempErrors.facilityId = editedEvent.facilityId ? "" : "Anläggning krävs";
      tempErrors.openingTime = editedEvent.openingTime ? "" : "Öppningstid krävs";
      tempErrors.closingTime = editedEvent.closingTime ? "" : "Stängningstid krävs";

      if (editedEvent.openingTime && editedEvent.closingTime) {
        const opening = new Date(editedEvent.openingTime);
        const closing = new Date(editedEvent.closingTime);
        if (opening >= closing) {
          tempErrors.closingTime = "Stängningstid måste vara efter öppningstid";
        }
      }
    } else if (editedEvent.type === 'instructorSchedule') {
      tempErrors.instructorId = editedEvent.instructorId ? "" : "Instruktör krävs";
      tempErrors.facilityId = editedEvent.facilityId ? "" : "Anläggning krävs";
      tempErrors.startTime = editedEvent.startTime ? "" : "Starttid krävs";
      tempErrors.endTime = editedEvent.endTime ? "" : "Sluttid krävs";

      if (editedEvent.startTime && editedEvent.endTime) {
        const start = new Date(editedEvent.startTime);
        const end = new Date(editedEvent.endTime);
        if (start >= end) {
          tempErrors.endTime = "Sluttid måste vara efter starttid";
        }
      }
    }

    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleDeleteClick = () => {
    setEventToDelete(editedEvent);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteConfirmOpen(false);
    if (eventToDelete) {
      await handleDelete(eventToDelete);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
    setEventToDelete(null);
  };

  const handleDelete = async (eventToDelete) => {
    console.log('Attempting to delete event:', eventToDelete);
    console.log('Event ID:', eventToDelete.id);
    console.log('Event type:', eventToDelete.type);
    console.log('User role:', user?.role);

    const token = getToken();
    console.log('User token:', token);

    let response;
    if (eventToDelete.type === 'booking') {
      response = await BookingService.deleteBooking(eventToDelete.id, token);
    } else if (eventToDelete.type === 'openingHours') {
      response = await OpeningHoursService.deleteOpeningHours(eventToDelete.id);
    }

    console.log(`Delete ${eventToDelete.type} response:`, response);
    if (response.success) {
      onEventDelete(eventToDelete);
      onClose();
    } else {
      setErrors({ submit: response.error });
    }
  };

  const renderEventDetails = () => {
    if (!editedEvent) return null;

    if (isEditing || isCreating) {
      switch (editedEvent.type) {
        case 'booking':
          return (
            <>
              <TextField
                label="Titel"
                name="title"
                value={editedEvent.title || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Anläggning</InputLabel>
                <Select
                  name="facilityId"
                  value={editedEvent.facilityId || ''}
                  onChange={handleInputChange}
                  label="Anläggning"
                >
                  {facilities.map(facility => (
                    <MenuItem key={facility.id} value={facility.id}>{facility.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={sv}>
                <DateTimePicker
                  label="Välj datum och tid"
                  value={editedEvent.startTime ? new Date(editedEvent.startTime) : null}
                  onChange={(newValue) => handleInputChange({ target: { name: 'startTime', value: newValue } })}
                  slotProps={{
                    textField: { fullWidth: true, margin: "normal" },
                    actionBar: {
                      actions: ['cancel', 'accept'],
                      translations: {
                        cancel: 'Avbryt',
                        accept: 'Spara',
                      },
                    },
                    desktopPaper: {
                      sx: {
                        '& .MuiTypography-root': { fontSize: '1rem' },
                        '& .MuiPickersDay-root': { fontSize: '1rem' },
                        '& .MuiClock-squareMask': { transform: 'scale(0.9)' },
                        '& .MuiDateTimePickerToolbar-dateContainer': {
                          display: 'flex',
                          alignItems: 'baseline',
                          '& > *': { marginRight: '8px', fontSize: '1rem' }
                        },
                        '& .MuiDateTimePickerToolbar-timeContainer': {
                          display: 'flex',
                          alignItems: 'baseline',
                          '& > *': { marginRight: '8px', fontSize: '1rem' }
                        }
                      }
                    }
                  }}
                  format="d MMM yyyy HH:mm"
                />
                <DateTimePicker
                  label="Sluttid"
                  value={editedEvent.endTime ? new Date(editedEvent.endTime) : null}
                  onChange={(newValue) => handleInputChange({ target: { name: 'endTime', value: newValue } })}
                  slotProps={{
                    textField: { fullWidth: true, margin: "normal" },
                    desktopPaper: {
                      sx: {
                        '& .MuiTypography-root': { fontSize: '1rem' },
                        '& .MuiPickersDay-root': { fontSize: '1rem' },
                        '& .MuiClock-squareMask': { transform: 'scale(0.9)' },
                        '& .MuiDateTimePickerToolbar-dateContainer': {
                          display: 'flex',
                          alignItems: 'baseline',
                          '& > *': { marginRight: '8px' }
                        },
                        '& .MuiDateTimePickerToolbar-timeContainer': {
                          display: 'flex',
                          alignItems: 'baseline',
                          '& > *': { marginRight: '8px' }
                        }
                      }
                    }
                  }}
                  format="d MMM yyyy HH:mm"
                />
              </LocalizationProvider>
            </>
          );
        case 'openingHours':
          return (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Anläggning</InputLabel>
                <Select
                  name="facilityId"
                  value={editedEvent.facilityId || ''}
                  onChange={handleInputChange}
                  label="Anläggning"
                >
                  {facilities.map(facility => (
                    <MenuItem key={facility.id} value={facility.id}>{facility.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Öppnar"
                type="datetime-local"
                name="openingTime"
                value={editedEvent.openingTime ? new Date(editedEvent.openingTime).toISOString().slice(0, 16) : ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Stänger"
                type="datetime-local"
                name="closingTime"
                value={editedEvent.closingTime ? new Date(editedEvent.closingTime).toISOString().slice(0, 16) : ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Ansvarig ledare</InputLabel>
                <Select
                  name="assignedLeaderId"
                  value={editedEvent.assignedLeaderId || ''}
                  onChange={handleInputChange}
                  label="Ansvarig ledare"
                >
                  <MenuItem value="">Ingen ansvarig ledare</MenuItem>
                  {filteredMembers.map(member => (
                    <MenuItem key={member.id} value={member.id}>{member.firstName} {member.lastName} ({member.role})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          );
        case 'instructorSchedule':
          return (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Anläggning</InputLabel>
                <Select
                  name="facilityId"
                  value={editedEvent.facilityId || ''}
                  onChange={handleInputChange}
                  label="Anläggning"
                >
                  {facilities.map(facility => (
                    <MenuItem key={facility.id} value={facility.id}>{facility.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Instruktör</InputLabel>
                <Select
                  name="instructorId"
                  value={editedEvent.instructorId || ''}
                  onChange={handleInputChange}
                >
                  {filteredInstructors.map(instructor => (
                    <MenuItem key={instructor.id} value={instructor.id}>{instructor.firstName} {instructor.lastName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Starttid"
                type="datetime-local"
                name="startTime"
                value={editedEvent.startTime ? new Date(editedEvent.startTime).toISOString().slice(0, 16) : ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Sluttid"
                type="datetime-local"
                name="endTime"
                value={editedEvent.endTime ? new Date(editedEvent.endTime).toISOString().slice(0, 16) : ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </>
          );
        default:
          return null;
      }
    } else {
      // Display mode (not editing)
      if (!event) return null;
      
      switch (event.type) {
        case 'booking':
          return (
            <>
              <Typography variant="h6">{event.title}</Typography>
              <Typography>Anläggning: {event.facilityName}</Typography>
              <Typography>Starttid: {formatTime(event.startTime)}</Typography>
              <Typography>Sluttid: {formatTime(event.endTime)}</Typography>
            </>
          );
        case 'openingHours':
          return (
            <>
              <Typography variant="h6">Öppettider</Typography>
              <Typography>Anläggning: {event.facilityName}</Typography>
              <Typography>Öppnar: {formatTime(event.openingTime)}</Typography>
              <Typography>Stänger: {formatTime(event.closingTime)}</Typography>
              {event.assignedLeaderName && (
                <Typography>Ansvarig ledare: {event.assignedLeaderName}</Typography>
              )}
            </>
          );
        case 'instructorSchedule':
          return (
            <>
              <Typography variant="h6">Instruktörsschema</Typography>
              <Typography>Instruktör: {event.instructorName}</Typography>
              <Typography>Anläggning: {event.facilityName}</Typography>
              <Typography>Starttid: {formatTime(event.startTime)}</Typography>
              <Typography>Sluttid: {formatTime(event.endTime)}</Typography>
            </>
          );
      }
    }
  };

  const canEdit = user && (user.role === 'ADMIN' || 
                (user.role === 'INSTRUCTOR' && event.type === 'booking') || 
                (user.role === 'USER' && event.type === 'booking' && event.memberId === user.memberId));

  const canDelete = user && (user.role === 'ADMIN' || 
                  (user.role === 'USER' && event.type === 'booking' && event.memberId === user.memberId));

  const renderDateTimePickerInput = (props) => {
    const { inputRef, inputProps, InputProps, ...other } = props;
    return (
      <TextField
        {...other}
        inputRef={inputRef}
        InputProps={{
          ...InputProps,
          endAdornment: (
            <>
              {InputProps?.endAdornment}
              <Button onClick={() => props.onClose()}>Stäng</Button>
            </>
          ),
        }}
      />
    );
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        {renderEventDetails()}
        {isEditing || isCreating ? (
          <>
            <Button onClick={handleSave} sx={{ mt: 2, mr: 1 }}>Spara</Button>
            <Button onClick={handleCancel} sx={{ mt: 2 }}>Avbryt</Button>
          </>
        ) : (
          <>
            {canEdit && <Button onClick={handleEdit} sx={{ mt: 2, mr: 1 }}>Redigera</Button>}
            {canDelete && <Button onClick={handleDeleteClick} sx={{ mt: 2, mr: 1 }}>Ta bort</Button>}
            <Button onClick={onClose} sx={{ mt: 2 }}>Stäng</Button>
          </>
        )}
        <Dialog
          open={isDeleteConfirmOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Ta bort event?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Är du säker på att du vill ta bort detta event?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              Avbryt
            </Button>
            <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
              Ta bort
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  );
};

export default EventDetailsModal;
