import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const NewsManagement = () => {
  const newsItems = [
    { id: 1, title: 'Ny skjutbana öppnad', date: '2023-05-01' },
    { id: 2, title: 'Kommande tävling i juni', date: '2023-05-15' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Hantera Nyhetsinlägg
      </Typography>
      <List>
        {newsItems.map((item) => (
          <ListItem key={item.id}>
            <ListItemText 
              primary={item.title}
              secondary={`Publicerad: ${item.date}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit">
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default NewsManagement;
