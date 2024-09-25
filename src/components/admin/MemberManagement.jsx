import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, TablePagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data
  const dummyMembers = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', phoneNumber: '123-456-7890', address: '123 Main St', postalCode: '12345', city: 'Anytown', membershipType: 'Full', memberSince: '2022-01-01' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phoneNumber: '098-765-4321', address: '456 Elm St', postalCode: '67890', city: 'Othertown', membershipType: 'Junior', memberSince: '2022-02-15' },
    // Add more dummy data here...
  ];

  useEffect(() => {
    // In a real application, you would fetch data from an API here
    setMembers(dummyMembers);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredMembers = members.filter((member) =>
    Object.values(member).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const displayedMembers = filteredMembers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Hantera Medlemmar
      </Typography>
      <TextField
        label="Sök medlemmar"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Förnamn</TableCell>
              <TableCell>Efternamn</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Adress</TableCell>
              <TableCell>Postnummer</TableCell>
              <TableCell>Stad</TableCell>
              <TableCell>Medlemstyp</TableCell>
              <TableCell>Medlem sedan</TableCell>
              <TableCell>Åtgärder</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.firstName}</TableCell>
                <TableCell>{member.lastName}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phoneNumber}</TableCell>
                <TableCell>{member.address}</TableCell>
                <TableCell>{member.postalCode}</TableCell>
                <TableCell>{member.city}</TableCell>
                <TableCell>{member.membershipType}</TableCell>
                <TableCell>{member.memberSince}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredMembers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default MemberManagement;
