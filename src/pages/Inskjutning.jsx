import React from 'react';
import { Container, Box, Grid, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Inskjutning = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Box
              sx={{
                height: '400px',
                backgroundColor: 'grey.300',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Placeholder for Image
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Typography variant="h2" component="h1" gutterBottom>
              Inskjutningsbana
            </Typography>
            <Typography variant="h5" paragraph>
              I anslutning till banan har vi en inskjutningsbana på 100 meter.
            </Typography>
            <Typography variant="body1" paragraph>
              Perfekt för att testa ny ammunition eller det nya kikarsiktet, 
              eller varför inte skjuta in bössan inför långhållsskytte.
            </Typography>
            <Button variant="contained" size="large" onClick={() => navigate('/calendar')}>
              Boka banan
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Inskjutning;
