import React from 'react';
import { Container, Box, Grid, Typography, Button } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', py: { xs: 4, md: 8 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: { xs: '300px', md: '400px' },
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <img
                src="/src/assets/huntingtower.jpg"
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
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              Välkommen till Åseda Jaktvårdsförening
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
            Vår förening erbjuder en mängd olika aktiviteter och tjänster för jägare och naturälskare. 
            Vi har moderna skjutbanor, utbildningar och evenemang som passar både nybörjare och erfarna jägare.
            </Typography>
            <Button variant="contained" size="large" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
              Se våra öppetider
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
