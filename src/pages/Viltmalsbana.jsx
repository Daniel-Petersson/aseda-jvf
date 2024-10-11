import React from 'react';
import { Container, Box, Grid, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Viltmalsbana = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Box
              sx={{
                height: '400px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <img
                src="/src/assets/vildsvin.jpg"
                alt="Åseda Jaktvårdsförening"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Typography variant="h2" component="h1" gutterBottom>
                Viltmålsbana
            </Typography>
            <Typography variant="h5" paragraph>
                50 meters löpande viltmålsbana, elektronisk markering och automatisk utskrift av skjutresultat.
            </Typography>
            <Typography variant="body1" paragraph>
            Upplev spänningen och utmaningen med vår toppmoderna viltmålsbana! Här kan du testa dina färdigheter på en 50 meters löpande viltmålsbana med elektronisk markering och automatisk utskrift av skjutresultat. Perfekt för både nybörjare och erfarna skyttar som vill förbättra sin precision och reaktionsförmåga. Boka din tid idag och ta del av en oförglömlig skytteupplevelse!
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

export default Viltmalsbana;
