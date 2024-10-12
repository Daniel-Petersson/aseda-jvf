import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

const Home = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src="/src/assets/skog.jpg"
        alt="Åseda Jaktvårdsförening"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
      <Container
        maxWidth="lg"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <Typography variant="h1Home" component="h1" gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' }, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Välkommen till Åseda Jaktvårdsförening
        </Typography>
        <Typography variant="body3" paragraph sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, maxWidth: '600px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          Vår förening erbjuder en mängd olika aktiviteter och tjänster för jägare och naturälskare. 
          Vi har moderna skjutbanor, utbildningar och evenemang som passar både nybörjare och erfarna jägare.
        </Typography>
        <Button variant="contained" size="large" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, mt: 2, width: 'fit-content' }}>
          Se våra öppetider
        </Button>
      </Container>
    </Box>
  );
};

export default Home;
