import React from 'react';
import { Container, Box, Grid, Typography, Button } from '@mui/material';

const Algbana = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
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
                src="/src/assets/hagel.jpg"
                alt="Åseda Jaktvårdsförening"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom>
                Trapp och Skeetbana
            </Typography>
            <Typography variant="h5" paragraph>
            Vår moderna trapp- och skeetbana erbjuder en spännande och utmanande skytteupplevelse för alla nivåer.
            </Typography>
            <Typography variant="body1" paragraph>
            Upplev spänningen och utmaningen med vår toppmoderna trapp- och skeetbana! Här kan du testa dina färdigheter och förbättra din precision i en säker och kontrollerad miljö. Perfekt för både nybörjare och erfarna skyttar som vill ta sitt skytte till nästa nivå. Banan är utrustad med den senaste tekniken för att säkerställa en optimal skytteupplevelse. Boka din tid idag och ta del av en oförglömlig skytteupplevelse!
            </Typography>
            <Button variant="contained" size="large">
              Boka banan
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Algbana;
