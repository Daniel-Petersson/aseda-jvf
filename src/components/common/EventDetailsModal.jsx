import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import * as BookingService from '../../services/BookingService';
import * as OpeningHoursService from '../../services/OpeningHoursService';
import * as InstructorScheduleService from '../../services/InstructorScheduleService';
import * as FacilityService from '../../services/FacilityService';

const EventDetailsModal = ({ isOpen, onClose, event, onEventUpdate, onEventCreate, onEventDelete, isCreating, userRole, isAuthenticated }) => {
  const [editedEvent, setEditedEvent] = useState(event);
  const [facilities, setFacilities] = useState([]);
  const [isEditing, setIsEditing] = useState(isCreating);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isCreating) {
      setEditedEvent({
        type: event?.type || 'booking',
        ...event
      });
    } else {
      setEditedEvent(event || null);
    }
    setIsEditing(isCreating);
    fetchFacilities();
  }, [event, isCreating]);

  const fetchFacilities = async () => {
    const response = await FacilityService.getAllFacilities();
    if (response.success) {
      setFacilities(response.data);
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
      if (isCreating) {
        if (editedEvent.type === 'booking') {
          await onEventCreate(editedEvent);
        } else if (editedEvent.type === 'openingHours') {
          const response = await OpeningHoursService.createOpeningHours(editedEvent);
          if (response.success) {
            onClose();
            // You might want to refresh the calendar or update the events state here
          } else {
            setErrors({ submit: response.error });
          }
        } else if (editedEvent.type === 'instructorSchedule') {
          const response = await InstructorScheduleService.createSchedule(editedEvent);
          if (response.success) {
            onClose();
            // You might want to refresh the calendar or update the events state here
          } else {
            setErrors({ submit: response.error });
          }
        }
      } else {
        await onEventUpdate(editedEvent);
      }
      setIsEditing(false);
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
    if (window.confirm('Är du säker på att du vill ta bort detta event?')) {
      await onEventDelete(event);
      onClose();
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
                label="Öppningstid"
                type="datetime-local"
                name="openingTime"
                value={editedEvent.openingTime ? new Date(editedEvent.openingTime).toISOString().slice(0, 16) : ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Stängningstid"
                type="datetime-local"
                name="closingTime"
                value={editedEvent.closingTime ? new Date(editedEvent.closingTime).toISOString().slice(0, 16) : ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </>
          );
        case 'instructorSchedule':
          return (
            <>
              {userRole === 'ADMIN' && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Instruktör</InputLabel>
                  <Select
                    value={editedEvent.instructorId || ''}
                    onChange={handleInputChange}
                    name="instructorId"
                  >
                    {instructors.map(instructor => (
                      <MenuItem key={instructor.id} value={instructor.id}>{instructor.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
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
