import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Paper,
  Alert // Lägg till denna import
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Lägg till useNavigate
import { AuthContext } from '../utils/AuthContext'; // Import AuthContext
import { authenticateMember } from '../services/MemberService'; // Importera loginMember funktion

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Lägg till error state
  const navigate = useNavigate(); // Använd useNavigate hook
  const { login } = useContext(AuthContext); // Use AuthContext

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await authenticateMember({ email, password });
      const token = result.data; 
      if (token) {
        login(token); // Use login method from AuthContext
        navigate('/member');
      } else {
        console.error('Authentication failed or token is missing:', result);
        setError(result.error || 'Authentication failed. No token returned.');
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Logga in
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-postadress"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Lösenord"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Logga in
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Har du inget konto? Registrera dig"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;