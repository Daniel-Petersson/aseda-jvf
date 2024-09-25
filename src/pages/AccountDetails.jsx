import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import MemberForm from '../components/common/MemberForm';

const AccountDetails = () => {
  // Dummydata för användaren
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '0701234567',
    address: 'Exempelgatan 1',
    postalCode: '36433',
    city: 'Åseda',
  });

  const handleSubmit = (updatedData) => {
    setUserData(updatedData);
    console.log('Uppdaterad användardata:', updatedData);
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
          Kontouppgifter
        </Typography>
        <MemberForm
          initialData={userData}
          onSubmit={handleSubmit}
          isProfile={true}
        />
      </Paper>
    </Box>
  );
};

export default AccountDetails;
