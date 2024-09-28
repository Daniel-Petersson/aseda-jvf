import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Alert, Button, Checkbox, FormControlLabel, Link } from '@mui/material';
import { registerMember } from '../services/MemberService';
import MemberForm from '../components/common/MemberForm';

function Register() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (memberData) => {
    if (!termsAccepted || !privacyAccepted) {
      setError('Du måste acceptera villkoren och integritetspolicyn för att registrera dig.');
      return;
    }

    try {
      const result = await registerMember(memberData);
      if (result.success) {
        setSuccess(true);
        setError(null);
      } else {
        setError(result.error || 'Ett fel uppstod vid registreringen.');
        setSuccess(false);
      }
    } catch (error) {
      console.error('Fel vid registrering av medlem:', error);
      setError('Ett oväntat fel inträffade. Vänligen försök igen.');
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
        Välkommen till vårt medlemsregister!
        </Typography>
        <Typography variant="body1" gutterBottom align="center">
        Vill du bli en del av vår gemenskap? Fyll i dina uppgifter nedan för att registrera dig som medlem i föreningen. Som medlem får du möjlighet att delta i våra aktiviteter, påverka föreningens arbete och träffa likasinnade. Välkommen in!
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success ? (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              Registreringen lyckades! Du kan nu logga in.
            </Alert>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLoginNavigation}
              sx={{ mt: 2 }}
            >
              Gå till inloggning
            </Button>
          </>
        ) : (
          <>
            <MemberForm 
              onSubmit={handleSubmit} 
              isEditing={true} 
              submitButtonText="Registrera"
            />
            <FormControlLabel
              control={<Checkbox checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />}
              label={<>Jag accepterar <Link href="/terms" target="_blank">användarvillkoren</Link></>}
            />
            <FormControlLabel
              control={<Checkbox checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} />}
              label={<>Jag har läst och godkänner <Link href="/privacy" target="_blank">integritetspolicyn</Link></>}
            />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Vi samlar endast in nödvändig information för att hantera ditt medlemskap. 
              Dina uppgifter behandlas säkert och delas inte med tredje part utan ditt samtycke.
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default Register;