import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import MemberForm from '../components/common/MemberForm';

const Register = () => {
  const initialData = {
    firstName: '',
    lastName: '',
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    email: ''
  };

  const handleSubmit = (formData) => {
    // Här kan du lägga till logik för att hantera formulärinlämningen
    console.log('Form submitted', formData);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
      color="text.primary"
      py={4}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
        <Typography variant="h4" gutterBottom align="center">
          Föreningsregistret
        </Typography>
        <Typography variant="body1" gutterBottom align="center">
          Ange dina uppgifter för att komma med i föreningsregistret!
        </Typography>
        <MemberForm
          initialData={initialData}
          onSubmit={handleSubmit}
          showRadioButtons={false}
        />
      </Paper>
    </Box>
  );
};

export default Register;