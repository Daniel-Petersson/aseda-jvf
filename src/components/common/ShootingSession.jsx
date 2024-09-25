import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Table, 
  TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Autocomplete
} from '@mui/material';

const ShootingSession = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [shots, setShots] = useState([]);
  const [currentShot, setCurrentShot] = useState('');
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    // Här skulle du normalt hämta medlemmar från din backend
    // För nu använder vi dummy data
    setMembers([
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Smith' },
      // Lägg till fler medlemmar här
    ]);
  }, []);

  const handleStartSession = () => {
    if (selectedMember) {
      setSessionActive(true);
      setShots([]);
    }
  };

  const handleEndSession = () => {
    // Här skulle du normalt spara sessionen till din backend
    console.log('Session ended for:', selectedMember);
    console.log('Shots:', shots);
    setSessionActive(false);
    setSelectedMember(null);
    setShots([]);
  };

  const handleAddShot = () => {
    if (currentShot && sessionActive) {
      setShots([...shots, { id: Date.now(), score: parseInt(currentShot, 10) }]);
      setCurrentShot('');
    }
  };

  const totalScore = shots.reduce((sum, shot) => sum + shot.score, 0);

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shooting Session Management
      </Typography>
      <Autocomplete
        options={members}
        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
        renderInput={(params) => <TextField {...params} label="Search Member" />}
        onChange={(event, newValue) => {
          setSelectedMember(newValue);
        }}
        disabled={sessionActive}
        sx={{ mb: 2 }}
      />
      <Box sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleStartSession} 
          disabled={sessionActive || !selectedMember}
          sx={{ mr: 2 }}
        >
          Start Session
        </Button>
        <Button 
          variant="contained" 
          onClick={handleEndSession} 
          disabled={!sessionActive}
        >
          End Session
        </Button>
      </Box>
      {sessionActive && (
        <>
          <Typography variant="h5" gutterBottom>
            Session for {selectedMember.firstName} {selectedMember.lastName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              label="Shot Score"
              value={currentShot}
              onChange={(e) => setCurrentShot(e.target.value)}
              type="number"
              InputProps={{ inputProps: { min: 0, max: 10 } }}
              sx={{ mr: 2, width: '100px' }}
            />
            <Button 
              variant="contained" 
              onClick={handleAddShot}
            >
              Add Shot
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Shot Number</TableCell>
                  <TableCell align="right">Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shots.map((shot, index) => (
                  <TableRow key={shot.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell align="right">{shot.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="h6">
            Total Score: {totalScore}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default ShootingSession;
