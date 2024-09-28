import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Alert, Button } from '@mui/material';
import { registerMember } from '../services/MemberService';
import MemberForm from '../components/common/MemberForm';

function Register() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (memberData) => {
    try {
      console.log('Starting registration process');
      const result = await registerMember(memberData);
      console.log('Registration result:', result);
      if (result.success) {
        console.log('Member registered successfully:', result.data);
        setSuccess(true);
        setError(null);
      } else {
        console.log('Registration failed:', result.error);
        setError(result.error || 'An error occurred while registering.');
        setSuccess(false);
      }
    } catch (error) {
      console.error('Error registering member:', error);
      setError('An unexpected error occurred. Please try again.');
      setSuccess(false);
    }
  };

  const handleLoginNavigation = () => {
    navigate('/login');
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success ? (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              Registration successful! You can now log in.
            </Alert>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLoginNavigation}
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </>
        ) : (
          <MemberForm onSubmit={handleSubmit} />
        )}
      </Paper>
    </Box>
  );
}

export default Register;