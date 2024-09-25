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
                src="/src/assets/moose.jpg"
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
              Älgbana
            </Typography>
            <Typography variant="h5" paragraph>
              Traditionell 80 meters löpande älg, elektronisk markering och automatisk utskrift av skjutresultat.
            </Typography>
            <Typography variant="body1" paragraph>
              Upplev spänningen och utmaningen med vår traditionella 80 meters löpande älgbana! Här kan du testa dina färdigheter med elektronisk markering och automatisk utskrift av skjutresultat. Perfekt för både nybörjare och erfarna skyttar som vill förbättra sin precision och reaktionsförmåga. Banan är godkänd för jägarexamen och kan bokas via vår hemsida. Boka din tid idag och ta del av en oförglömlig skytteupplevelse!
            </Typography>
            <Button variant="contained" size="large" color="primary">
              Boka banan
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Algbana;
