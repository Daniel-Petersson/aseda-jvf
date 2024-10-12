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

const EventDetailsModal = ({ open, onClose, event, onEdit, isAdmin, facilities, members }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);

  useEffect(() => {
    if (event) {
      setEditedEvent({
        ...event,
        startTime: event.start instanceof Date ? event.start.toISOString().slice(0, 16) : event.start,
        endTime: event.end instanceof Date ? event.end.toISOString().slice(0, 16) : event.end
      });
    }
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? `Redigera ${event.extendedProps.type}` : event.title}</DialogTitle>
      <DialogContent>
        {isEditing ? (
          renderFields()
        ) : (
          <>
            <Typography variant="body1">
              Start: {event.start ? new Date(event.start).toLocaleString() : 'Ej angivet'}
            </Typography>
            <Typography variant="body1">
              Slut: {event.end ? new Date(event.end).toLocaleString() : 'Ej angivet'}
            </Typography>
            <Typography variant="body1">
              Anläggning: {facilities.find(f => f.id === event.extendedProps.facilityId)?.name || 'Ej angivet'}
            </Typography>
          </>
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
