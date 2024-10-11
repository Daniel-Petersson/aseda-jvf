import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Box, Typography, CircularProgress, Paper, Alert, Button } from '@mui/material';
import MemberForm from '../components/common/MemberForm';
import { getMember, updateMember } from '../services/MemberService';
import { AuthContext } from '../utils/AuthContext'; // Import AuthContext

const AccountDetails = () => {
  const { user } = useContext(AuthContext); // Use AuthContext
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (user) {
      try {
        const memberId = user.memberId;
        const result = await getMember(memberId);
        if (result.success) {
          setUserData(result.data);
        } else {
          setError('Failed to fetch user data. Please try logging in again.');
        }
      } catch (error) {
        setError('Invalid or expired token. Please log in again.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('No authentication token found. Please log in.');
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleEditToggle = useCallback(() => {
    setIsEditing((prev) => !prev);
    setError(null);
    setSuccess(false);
  }, []);

  const handleSubmit = async (formData) => {
    try {
      const result = await updateMember(userData.id, formData);
      if (result.success) {
        setSuccess(true);
        setError(null);
        setUserData(result.data);
        setIsEditing(false);
      } else {
        setError(result.error || 'Ett fel uppstod vid uppdatering av uppgifterna.');
        setSuccess(false);
      }
    } catch (error) {
      console.error('Error updating member:', error);
      setError('Ett oväntat fel inträffade. Vänligen försök igen.');
      setSuccess(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

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
          Mina uppgifter
        </Typography>
        <Typography variant="body1" gutterBottom align="center">
          Här kan du se och uppdatera dina uppgifter i föreningsregistret.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Dina uppgifter har uppdaterats framgångsrikt!
          </Alert>
        )}
        {userData && (
          <>
            <MemberForm
              initialData={userData}
              onSubmit={handleSubmit}
              isEditing={isEditing}
              submitButtonText={isEditing ? "Spara ändringar" : "Ändra uppgifter"}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleEditToggle}
              sx={{ mt: 2 }}
            >
              {isEditing ? "Avbryt" : "Ändra uppgifter"}
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default AccountDetails;
