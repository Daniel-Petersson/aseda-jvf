import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import { useTheme } from '@mui/material/styles'; // Add this import

const Footer = () => {
  const theme = useTheme(); // Now this should work correctly

  return (
    <Box component="footer" sx={{ bgcolor: theme.palette.primary.main, py: 6, color: theme.palette.primary.contrastText }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              ÅSEDA JVF
            </Typography>
            <Typography variant="subtitle1" color="inherit">
              Grundad 1954
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Hitta hit
            </Typography>
            <Typography variant="body2" color="inherit">
              <LocationOnIcon /> Adress: Exempelgatan 123, 123 45 Exempelstad
            </Typography>
            <Typography variant="body2" color="inherit">
              Öppettider: Mån-Fre 09:00 - 17:00
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Kontaktinfo
            </Typography>
            <Typography variant="body2" color="inherit">
              <EmailIcon /> Email: info@asedajvf.com
            </Typography>
            <Typography variant="body2" color="inherit">
              <PhoneIcon /> Telefon: 012-345 67 89
            </Typography>
            <Box mt={2}>
              <Link href="#" color="inherit" sx={{ mr: 2 }}>
                <FacebookIcon />
              </Link>
              <Link href="#" color="inherit" sx={{ mr: 2 }}>
                <TwitterIcon />
              </Link>
              <Link href="#" color="inherit">
                <InstagramIcon />
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
