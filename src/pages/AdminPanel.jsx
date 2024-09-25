import React, { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab, Grid } from '@mui/material';
import MemberManagement from '../components/admin/MemberManagement';
import NewsManagement from '../components/admin/NewsManagement';
import ShootingSession from '../components/common/ShootingSession';

const AdminPanel = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'center',
            mb: 2
          }}>
            <Tabs 
              value={value} 
              onChange={handleChange} 
              aria-label="admin tabs"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab label="Member Management" />
              <Tab label="News Management" />
              <Tab label="Shooting Sessions" />
            </Tabs>
          </Box>
          <Box sx={{ mt: 2 }}>
            {value === 0 && <MemberManagement />}
            {value === 1 && <NewsManagement />}
            {value === 2 && <ShootingSession />}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPanel;