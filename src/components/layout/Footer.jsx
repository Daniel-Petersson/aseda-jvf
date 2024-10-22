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
    <Box component="footer" sx={{ bgcolor: theme.palette.primary.main, py: { xs: 3, sm: 6 }, color: theme.palette.primary.contrastText }}>
      <Container maxWidth="lg">
        <Grid container spacing={isMobile ? 2 : 4}>
          <Grid item xs={12} sm={4}>
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
              ÅSEDA JVF
            </Typography>
            <Typography variant="subtitle2" color="#F0EED6">
              Grundad 1954
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
              Hitta hit
            </Typography>
            <Typography variant="body2" color="#F0EED6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon sx={{ mr: 1, fontSize: isMobile ? '1rem' : '1.25rem' }} /> 
              Adress: Exempelgatan 123, 123 45 Exempelstad
            </Typography>
            <Typography variant="body2" color="#F0EED6">
              Öppettider: Mån-Fre 09:00 - 17:00
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
              Kontaktinfo
            </Typography>
            <Typography variant="body2" color="#F0EED6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon sx={{ mr: 1, fontSize: isMobile ? '1rem' : '1.25rem' }} /> 
              Email: info@asedajvf.com
            </Typography>
            <Typography variant="body2" color="#F0EED6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon sx={{ mr: 1, fontSize: isMobile ? '1rem' : '1.25rem' }} /> 
              Telefon: 012-345 67 89
            </Typography>
            <Box mt={2}>
              <Link href="#" color="#F0EED6" sx={{ mr: 2 }}>
                <FacebookIcon sx={{ fontSize: isMobile ? '1.5rem' : '2rem' }} />
              </Link>
              <Link href="#" color="#F0EED6" sx={{ mr: 2 }}>
                <TwitterIcon sx={{ fontSize: isMobile ? '1.5rem' : '2rem' }} />
              </Link>
              <Link href="#" color="#F0EED6">
                <InstagramIcon sx={{ fontSize: isMobile ? '1.5rem' : '2rem' }} />
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
