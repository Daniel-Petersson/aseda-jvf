import React, { useState, useEffect, useContext } from 'react';
import { Modal, Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import * as OpeningHoursService from '../../services/OpeningHoursService';
import * as InstructorScheduleService from '../../services/InstructorScheduleService';
import * as FacilityService from '../../services/FacilityService';
import * as BookingService from '../../services/BookingService';
import * as MemberService from '../../services/MemberService';
import { AuthContext } from '../../utils/AuthContext';

const EventDetailsModal = ({ isOpen, onClose, event, onEventUpdate, onEventCreate, onEventDelete, isCreating, userRole, isAuthenticated, user }) => {
  const [editedEvent, setEditedEvent] = useState(event);
  const [facilities, setFacilities] = useState([]);
  const [isEditing, setIsEditing] = useState(isCreating);
  const [errors, setErrors] = useState({});
  const [instructors, setInstructors] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);

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
      if (isCreating) {
        if (editedEvent.type === 'booking') {
          const bookingData = {
            ...editedEvent,
            memberId: user.memberId
          };
          response = await BookingService.createBooking(bookingData);
        } else if (editedEvent.type === 'openingHours') {
          response = await OpeningHoursService.createOpeningHours(editedEvent);
        } else if (editedEvent.type === 'instructorSchedule') {
          console.log('Creating instructor schedule with data:', editedEvent);
          response = await InstructorScheduleService.createSchedule(editedEvent);
        }
      } else {
        if (editedEvent.type === 'booking') {
          response = await BookingService.updateBooking(editedEvent.id, editedEvent, user.token);
        } else if (editedEvent.type === 'openingHours') {
          response = await OpeningHoursService.updateOpeningHours(editedEvent.id, editedEvent);
        } else if (editedEvent.type === 'instructorSchedule') {
          console.log('Updating instructor schedule with data:', editedEvent);
          response = await InstructorScheduleService.updateSchedule(editedEvent.id, editedEvent);
        }
      }

      console.log('Save response:', response);

      if (response.success) {
        onEventUpdate(editedEvent);
        setIsEditing(false);
        onClose();
      } else {
        setErrors({ submit: response.error });
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedEvent(event);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent(prev => ({ ...prev, [name]: value }));
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

  const handleDelete = async () => {
    console.log('Attempting to delete event:', editedEvent);
    console.log('Event ID:', editedEvent.id);
    console.log('Event type:', editedEvent.type);
    console.log('User role:', userRole);

    if (editedEvent.type === 'openingHours' && userRole === 'ADMIN') {
      try {
        console.log('Deleting opening hours with id:', editedEvent.id);
        if (!editedEvent.id) {
          console.error('Opening hours id is undefined');
          setErrors({ submit: 'Invalid opening hours id' });
          return;
        }
        const response = await OpeningHoursService.deleteOpeningHours(editedEvent.id);
        console.log('Delete opening hours response:', response);
        if (response.success) {
          onEventDelete(editedEvent);
          onClose();
        } else {
          setErrors({ submit: response.error });
        }
      } catch (error) {
        console.error('Error deleting opening hours:', error);
        setErrors({ submit: 'Failed to delete opening hours' });
      }
    } else if (editedEvent.type === 'booking' && userRole === 'ADMIN') {
      try {
        console.log('Deleting booking with id:', editedEvent.id);
        if (!editedEvent.id) {
          console.error('Booking id is undefined');
          setErrors({ submit: 'Invalid booking id' });
          return;
        }
        if (!user || !user.token) {
          console.error('User token is missing');
          setErrors({ submit: 'User authentication failed' });
          return;
        }
        const response = await BookingService.deleteBooking(editedEvent.id, user.token);
        console.log('Delete booking response:', response);
        if (response.success) {
          onEventDelete(editedEvent);
          onClose();
        } else {
          setErrors({ submit: response.error });
        }
      } catch (error) {
        console.error('Error deleting booking:', error);
        setErrors({ submit: 'Failed to delete booking' });
      }
    } else if (editedEvent.type === 'instructorSchedule' && userRole === 'ADMIN') {
      try {
        console.log('Deleting instructor schedule with id:', editedEvent.id);
        if (!editedEvent.id) {
          console.error('Instructor schedule id is undefined');
          setErrors({ submit: 'Invalid instructor schedule id' });
          return;
        }
        const response = await InstructorScheduleService.deleteSchedule(editedEvent.id);
        console.log('Delete instructor schedule response:', response);
        if (response.success) {
          onEventDelete(editedEvent);
          onClose();
        } else {
          setErrors({ submit: response.error });
        }
      } catch (error) {
        console.error('Error deleting instructor schedule:', error);
        setErrors({ submit: 'Failed to delete instructor schedule' });
      }
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
                  value={editedEvent.facilityId || ''}
                  onChange={handleInputChange}
                  name="facilityId"
                >
                  {facilities.map(facility => (
                    <MenuItem key={facility.id} value={facility.id}>{facility.name}</MenuItem>
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
        case 'openingHours':
          return (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Anläggning</InputLabel>
                <Select
                  name="facilityId"
                  value={editedEvent.facilityId || ''}
                  onChange={handleInputChange}
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

  const canEdit = userRole === 'ADMIN' || 
                  (userRole === 'INSTRUCTOR' && event.type === 'booking') || 
                  (userRole === 'USER' && event.type === 'booking' && event.memberId === event.userId);

  const canDelete = userRole === 'ADMIN';

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        {renderEventDetails()}
        {canEdit && !isEditing && (
          <Button onClick={handleEdit} sx={{ mt: 2, mr: 2 }}>Redigera</Button>
        )}
        {isEditing && (
          <>
            <Button onClick={handleSave} sx={{ mt: 2, mr: 2 }}>Spara</Button>
            <Button onClick={handleCancel} sx={{ mt: 2, mr: 2 }}>Avbryt</Button>
          </>
        )}
        {canDelete && !isEditing && !isCreating && (
          <Button onClick={handleDelete} sx={{ mt: 2, mr: 2 }} color="error">Ta bort</Button>
        )}
        <Button onClick={onClose} sx={{ mt: 2 }}>Stäng</Button>
      </Box>
    </Modal>
  );
};

export default EventDetailsModal;
