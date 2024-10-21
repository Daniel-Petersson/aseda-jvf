import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const EventDetailsModal = ({ isOpen, onClose, event }) => {
  if (!event) return null;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderEventDetails = () => {
    if (event.type === 'openingHours') {
      return (
        <>
          <Typography variant="h6" component="h2" gutterBottom>
            Öppettider: {event.facilityName}
          </Typography>
          <Typography>Öppnar: {formatTime(event.openingTime)}</Typography>
          <Typography>Stänger: {formatTime(event.closingTime)}</Typography>
          <Typography>Skjutledare: {event.assignedLeaderName}</Typography>
        </>
      );
    } else if (event.type === 'booking') {
      return (
        <>
          <Typography variant="h6" component="h2" gutterBottom>
            Bokning: {event.title}
          </Typography>
          <Typography>Anläggning: {event.facilityName}</Typography>
          <Typography>Bokad av: {event.memberName}</Typography>
          <Typography>Starttid: {formatTime(event.startTime)}</Typography>
          <Typography>Sluttid: {formatTime(event.endTime)}</Typography>
          <Typography>Status: {event.status}</Typography>
        </>
      );
    } else if (event.type === 'instructorSchedule') {
      return (
        <>
          <Typography variant="h6" component="h2" gutterBottom>
            Instruktörsschema
          </Typography>
          <Typography>Anläggning: {event.facilityName}</Typography>
          <Typography>Instruktör: {event.instructorName}</Typography>
          <Typography>Starttid: {formatTime(event.startTime)}</Typography>
          <Typography>Sluttid: {formatTime(event.endTime)}</Typography>
        </>
      );
    }
  };

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
        <Button onClick={onClose} sx={{ mt: 2 }}>Stäng</Button>
      </Box>
    </Modal>
  );
};

export default EventDetailsModal;
