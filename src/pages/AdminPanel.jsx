import React, { useState, useContext } from 'react';
import { Container, Box, Tabs, Tab, Grid } from '@mui/material';
import MemberManagement from '../components/admin/MemberManagement';
import NewsManagement from '../components/admin/NewsManagement';
import ShootingSession from '../components/common/ShootingSession';
import { AuthContext } from '../utils/AuthContext'; // Import AuthContext

const AdminPanel = () => {
  const [value, setValue] = useState(0);
  const { user } = useContext(AuthContext); // Use AuthContext

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isInstructor = user?.role === 'INSTRUCTOR';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, width: '100%', overflowX: 'auto' }}>
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
              {isAdmin && <Tab label="Member Management" />}
              {isAdmin && <Tab label="News Management" />}
              <Tab label="Shooting Sessions" />
            </Tabs>
          </Box>
          <Box sx={{ mt: 2 }}>
            {isAdmin && value === 0 && <MemberManagement />}
            {isAdmin && value === 1 && <NewsManagement />}
            {(isAdmin && value === 2) || (isInstructor && value === 0) ? <ShootingSession /> : null}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPanel;