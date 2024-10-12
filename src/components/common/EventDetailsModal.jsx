import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from '@mui/material';

const EventDetailsModal = ({ open, onClose, event, onEdit, isAdmin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);

  useEffect(() => {
    if (event) {
      setEditedEvent({
        ...event,
        start: event.start instanceof Date ? event.start.toISOString() : event.start,
        end: event.end instanceof Date ? event.end.toISOString() : event.end
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

  const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 16);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? 'Redigera händelse' : event.title}</DialogTitle>
      <DialogContent>
        {isEditing ? (
          <>
            <TextField
              fullWidth
              margin="normal"
              name="title"
              label="Titel"
              value={editedEvent.title || ''}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="start"
              label="Start"
              type="datetime-local"
              value={formatDateTimeForInput(editedEvent.start)}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="normal"
              name="end"
              label="Slut"
              type="datetime-local"
              value={formatDateTimeForInput(editedEvent.end)}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
            {/* Lägg till fler fält baserat på händelsetyp */}
          </>
        ) : (
          <>
            <Typography variant="body1">
              Start: {event.start ? new Date(event.start).toLocaleString() : 'Ej angivet'}
            </Typography>
            <Typography variant="body1">
              Slut: {event.end ? new Date(event.end).toLocaleString() : 'Ej angivet'}
            </Typography>
            {/* Visa mer information baserat på händelsetyp */}
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