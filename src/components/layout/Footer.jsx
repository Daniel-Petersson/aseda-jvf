import React from 'react';
import { Box, Container, Grid, Typography, Link, useMediaQuery } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box component="footer" sx={{ 
      bgcolor: theme.palette.primary.main, 
      py: { xs: 2, sm: 3 }, 
      color: theme.palette.primary.contrastText,
      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={isMobile ? 1 : 2}>
          <Grid item xs={12} sm={4}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
              ÅSEDA JVF
            </Typography>
            <Typography variant="body2" color="#F0EED6">
              Grundad 1954
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
              Hitta hit
            </Typography>
            <Typography variant="body2" color="#F0EED6" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <LocationOnIcon sx={{ mr: 0.5, fontSize: isMobile ? '0.9rem' : '1rem' }} /> 
              Adress: Exempelgatan 123, 123 45 Exempelstad
            </Typography>
            <Typography variant="body2" color="#F0EED6">
              Öppettider: Mån-Fre 09:00 - 17:00
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
              Kontaktinfo
            </Typography>
            <Typography variant="body2" color="#F0EED6" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <EmailIcon sx={{ mr: 0.5, fontSize: isMobile ? '0.9rem' : '1rem' }} /> 
              Email: info@asedajvf.com
            </Typography>
            <Typography variant="body2" color="#F0EED6" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <PhoneIcon sx={{ mr: 0.5, fontSize: isMobile ? '0.9rem' : '1rem' }} /> 
              Telefon: 012-345 67 89
            </Typography>
            <Box mt={1}>
              <Link href="#" color="#F0EED6" sx={{ mr: 1 }}>
                <FacebookIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
              </Link>
              <Link href="#" color="#F0EED6" sx={{ mr: 1 }}>
                <TwitterIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
              </Link>
              <Link href="#" color="#F0EED6">
                <InstagramIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
