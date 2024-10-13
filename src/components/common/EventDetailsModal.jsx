import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Typography, 
  FormControlLabel, 
  Checkbox 
} from '@mui/material';
import BookingService from '../../services/BookingService';
import { getAllOpeningHours } from '../../services/OpeningHoursService';
import { getAvailabilityByFacility } from '../../services/FacilityAvailabilityService';
import { getAllSchedules } from '../../services/InstructorScheduleService';

const EventDetailsModal = ({ open, onClose, event, onEdit, isAdmin, facilities, members }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (event && event.extendedProps) {
        let detailedEvent;
        try {
          switch (event.extendedProps.type) {
            case 'booking':
              const bookings = await BookingService.getAllBookings();
              detailedEvent = bookings.find(booking => booking.id === event.id);
              break;
            case 'openingHours':
              const openingHours = await getAllOpeningHours();
              detailedEvent = openingHours.data.find(oh => oh.id === event.id);
              break;
            case 'facilityAvailability':
              const availabilities = await getAvailabilityByFacility();
              detailedEvent = availabilities.data.find(a => a.id === event.id);
              break;
            case 'instructorSchedule':
              const schedules = await getAllSchedules();
              detailedEvent = schedules.data.find(s => s.id === event.id);
              break;
            default:
              throw new Error('Unknown event type');
          }
          if (detailedEvent) {
            setEditedEvent({
              ...detailedEvent,
              startTime: detailedEvent.startTime || detailedEvent.openingTime,
              endTime: detailedEvent.endTime || detailedEvent.closingTime,
            });
          } else {
            console.error('Event not found');
          }
        } catch (error) {
          console.error('Failed to fetch event details:', error);
          // Här kan du lägga till en funktion för att visa ett felmeddelande för användaren
        }
      }
    };

    fetchEventDetails();
  }, [event]);

  if (!event || !editedEvent) return null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(editedEvent);
    setIsEditing(false);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent(prev => ({ ...prev, [name]: value }));
  };

  const renderFields = () => {
    switch (event.extendedProps.type) {
      case 'booking':
        return (
          <>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Titel"
              type="text"
              fullWidth
              value={editedEvent.title || ''}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="startTime"
              label="Start Time"
              type="datetime-local"
              fullWidth
              value={editedEvent.startTime || ''}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              name="endTime"
              label="End Time"
              type="datetime-local"
              fullWidth
              value={editedEvent.endTime || ''}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="dense">
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
            <FormControl fullWidth margin="dense">
              <InputLabel>Medlem</InputLabel>
              <Select
                name="memberId"
                value={editedEvent.memberId || ''}
                onChange={handleInputChange}
              >
                {members.map(member => (
                  <MenuItem key={member.id} value={member.id}>{`${member.firstName} ${member.lastName}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={editedEvent.status || ''}
                onChange={handleInputChange}
              >
                <MenuItem value="PENDING">Väntande</MenuItem>
                <MenuItem value="APPROVED">Godkänd</MenuItem>
                <MenuItem value="REJECTED">Avvisad</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      case 'openingHours':
        return (
          <>
            <FormControl fullWidth margin="dense">
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
              margin="dense"
              name="startTime"
              label="Öppningstid"
              type="datetime-local"
              fullWidth
              value={editedEvent.startTime || ''}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              name="endTime"
              label="Stängningstid"
              type="datetime-local"
              fullWidth
              value={editedEvent.endTime || ''}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Ansvarig Ledare</InputLabel>
              <Select
                name="assignedLeaderId"
                value={editedEvent.assignedLeaderId || ''}
                onChange={handleInputChange}
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
          </>
        );
      case 'facilityAvailability':
        return (
          <>
            <FormControl fullWidth margin="dense">
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
              margin="dense"
              name="startTime"
              label="Starttid"
              type="datetime-local"
              fullWidth
              value={editedEvent.startTime || ''}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              name="endTime"
              label="Sluttid"
              type="datetime-local"
              fullWidth
              value={editedEvent.endTime || ''}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="seasonal"
                  checked={editedEvent.seasonal || false}
                  onChange={(e) => handleInputChange({ target: { name: 'seasonal', value: e.target.checked } })}
                />
              }
              label="Säsongsbaserad"
            />
          </>
        );
      case 'instructorSchedule':
        return (
          <>
            <FormControl fullWidth margin="dense">
              <InputLabel>Instruktör</InputLabel>
              <Select
                name="instructorId"
                value={editedEvent.instructorId || ''}
                onChange={handleInputChange}
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
              margin="dense"
              name="startTime"
              label="Starttid"
              type="datetime-local"
              fullWidth
              value={editedEvent.startTime || ''}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              name="endTime"
              label="Sluttid"
              type="datetime-local"
              fullWidth
              value={editedEvent.endTime || ''}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </>
        );
      default:
        return null;
    }
  };

  const renderEventDetails = () => {
    if (!editedEvent || !event.extendedProps) return null;

    const facility = facilities.find(f => f.id === editedEvent.facilityId);
    const facilityName = facility ? facility.name : 'Ej angivet';

    switch (event.extendedProps.type) {
      case 'booking':
        const member = members.find(m => m.id === editedEvent.memberId);
        const memberName = member ? `${member.firstName} ${member.lastName}` : 'Ej angivet';
        return (
          <>
            <Typography variant="body1">Titel: {editedEvent.title}</Typography>
            <Typography variant="body1">Anläggning: {facilityName}</Typography>
            <Typography variant="body1">Medlem: {memberName}</Typography>
            <Typography variant="body1">Start: {new Date(editedEvent.startTime).toLocaleString()}</Typography>
            <Typography variant="body1">Slut: {new Date(editedEvent.endTime).toLocaleString()}</Typography>
            <Typography variant="body1">Status: {editedEvent.status}</Typography>
          </>
        );
      case 'openingHours':
        const leader = members.find(m => m.id === editedEvent.assignedLeaderId);
        const leaderName = leader ? `${leader.firstName} ${leader.lastName}` : 'Ej angivet';
        return (
          <>
            <Typography variant="body1">Anläggning: {facilityName}</Typography>
            <Typography variant="body1">Öppettid: {new Date(editedEvent.startTime).toLocaleString()}</Typography>
            <Typography variant="body1">Stängningstid: {new Date(editedEvent.endTime).toLocaleString()}</Typography>
            <Typography variant="body1">Ansvarig ledare: {leaderName}</Typography>
          </>
        );
      case 'facilityAvailability':
        return (
          <>
            <Typography variant="body1">Anläggning: {facilityName}</Typography>
            <Typography variant="body1">Starttid: {new Date(editedEvent.startTime).toLocaleString()}</Typography>
            <Typography variant="body1">Sluttid: {new Date(editedEvent.endTime).toLocaleString()}</Typography>
            <Typography variant="body1">Säsongsbaserad: {editedEvent.seasonal ? 'Ja' : 'Nej'}</Typography>
          </>
        );
      case 'instructorSchedule':
        const instructor = members.find(m => m.id === editedEvent.instructorId);
        const instructorName = instructor ? `${instructor.firstName} ${instructor.lastName}` : 'Ej angivet';
        return (
          <>
            <Typography variant="body1">Instruktör: {instructorName}</Typography>
            <Typography variant="body1">Anläggning: {facilityName}</Typography>
            <Typography variant="body1">Starttid: {new Date(editedEvent.startTime).toLocaleString()}</Typography>
            <Typography variant="body1">Sluttid: {new Date(editedEvent.endTime).toLocaleString()}</Typography>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? `Redigera ${event.extendedProps.type}` : event.title}</DialogTitle>
      <DialogContent>
        {isEditing ? (
          renderFields()
        ) : (
          renderEventDetails()
        )}
      </DialogContent>
      <DialogActions>
        {isAdmin && !isEditing && (
          <Button onClick={handleEdit} color="primary">
            Redigera
          </Button>
        )}
        {isEditing ? (
          <>
            <Button onClick={() => setIsEditing(false)} color="secondary">
              Avbryt
            </Button>
            <Button onClick={handleSave} color="primary">
              Spara
            </Button>
          </>
        ) : (
          <Button onClick={onClose} color="primary">
            Stäng
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailsModal;