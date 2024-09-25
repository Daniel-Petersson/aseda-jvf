import React from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const dummyData = [
  { id: 1, date: '2023-05-15', series: [
    { shots: ['T', '4', '5', '3'], total: 12 },
    { shots: ['5', '5', '4', '4'], total: 18 },
    { shots: ['3', 'T', '5', '4'], total: 12 },
  ]},
  { id: 2, date: '2023-05-20', series: [
    { shots: ['4', '3', '5', '5'], total: 17 },
    { shots: ['T', '4', '3', 'Boom'], total: 7 },
    { shots: ['5', '5', '4', '3'], total: 17 },
  ]},
];

const MemberArea = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ mt: 4 }}>
        Mina Skjutresultat - Älgbana
      </Typography>
      {dummyData.map((session) => (
        <Paper key={session.id} elevation={3} sx={{ mb: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Datum: {session.date}
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Serie</TableCell>
                  <TableCell>Skott 1</TableCell>
                  <TableCell>Skott 2</TableCell>
                  <TableCell>Skott 3</TableCell>
                  <TableCell>Skott 4</TableCell>
                  <TableCell>Totalt</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {session.series.map((serie, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    {serie.shots.map((shot, shotIndex) => (
                      <TableCell key={shotIndex} align="center">
                        {shot === 'Boom' ? '0' : shot}
                      </TableCell>
                    ))}
                    <TableCell align="center">{serie.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ))}
    </Container>
  );
};

export default MemberArea;