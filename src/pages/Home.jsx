import React from 'react';
import { Container, Box, Grid, Typography, Button } from '@mui/material';

const Home = () => {
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
            <Typography variant="h2" component="h1" gutterBottom>
              Välkommen till Åseda Jaktvårdsförening
            </Typography>
            <Typography variant="body1" paragraph>
            Vår förening erbjuder en mängd olika aktiviteter och tjänster för jägare och naturälskare. 
            Vi har moderna skjutbanor, utbildningar och evenemang som passar både nybörjare och erfarna jägare.
            </Typography>
            <Button variant="contained" size="large">
              Se våra öppetider
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
