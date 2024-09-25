import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Paper, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const MyCalendar = () => {
  const theme = useTheme();
  const [events, setEvents] = useState([
    { title: 'Event 1', date: '2023-09-25' },
    { title: 'Event 2', date: '2023-09-26' }
  ]);

  const handleDateClick = (info) => {
    alert(`Clicked on: ${info.dateStr}`);
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px', backgroundColor: theme.palette.background.default }}>
      <Typography variant="h2" gutterBottom>Kalender</Typography>
      <div style={{ color: '#5D6651' }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
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
          aspectRatio={1.35}
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
      <Button 
        variant="contained" 
        style={{ 
          marginTop: '20px', 
          color: '#D4A15E',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: '#D4A15E',
            color: '#5D6651',
          },
        }}
      >
        Lägg till händelse
      </Button>
    </Paper>
  );
};

export default MyCalendar;
