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
    { id: 3, firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', phoneNumber: '555-123-4567', address: '789 Oak St', postalCode: '54321', city: 'Smalltown', membershipType: 'Full', memberSince: '2022-03-20' },
    { id: 4, firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', phoneNumber: '111-222-3333', address: '321 Pine St', postalCode: '98765', city: 'Bigcity', membershipType: 'Junior', memberSince: '2022-04-10' },
    { id: 5, firstName: 'Charlie', lastName: 'Davis', email: 'charlie@example.com', phoneNumber: '444-555-6666', address: '654 Maple St', postalCode: '45678', city: 'Middletown', membershipType: 'Full', memberSince: '2022-05-05' },
    { id: 6, firstName: 'Diana', lastName: 'Evans', email: 'diana@example.com', phoneNumber: '777-888-9999', address: '876 Birch St', postalCode: '34567', city: 'Villagetown', membershipType: 'Junior', memberSince: '2022-06-15' },
    { id: 7, firstName: 'Ethan', lastName: 'Foster', email: 'ethan@example.com', phoneNumber: '222-333-4444', address: '987 Cedar St', postalCode: '23456', city: 'Hamlet', membershipType: 'Full', memberSince: '2022-07-25' },
    { id: 8, firstName: 'Fiona', lastName: 'Garcia', email: 'fiona@example.com', phoneNumber: '666-777-8888', address: '543 Walnut St', postalCode: '10987', city: 'Townsville', membershipType: 'Junior', memberSince: '2022-08-30' },
    { id: 9, firstName: 'George', lastName: 'Harris', email: 'george@example.com', phoneNumber: '999-000-1111', address: '765 Redwood St', postalCode: '87654', city: 'Metropolis', membershipType: 'Full', memberSince: '2022-09-05' },
    { id: 10, firstName: 'Hannah', lastName: 'Jackson', email: 'hannah@example.com', phoneNumber: '333-444-5555', address: '432 Spruce St', postalCode: '76543', city: 'Countryside', membershipType: 'Junior', memberSince: '2022-10-10' },
    { id: 11, firstName: 'Ian', lastName: 'King', email: 'ian@example.com', phoneNumber: '888-999-0000', address: '678 Fir St', postalCode: '65432', city: 'Suburbia', membershipType: 'Full', memberSince: '2022-11-15' },
    { id: 12, firstName: 'Jasmine', lastName: 'Lee', email: 'jasmine@example.com', phoneNumber: '123-456-7890', address: '567 Maple Ave', postalCode: '54321', city: 'Hometown', membershipType: 'Junior', memberSince: '2022-12-20' },
    { id: 13, firstName: 'Kyle', lastName: 'Martin', email: 'kyle@example.com', phoneNumber: '555-666-7777', address: '890 Birch St', postalCode: '43210', city: 'Villagetown', membershipType: 'Full', memberSince: '2023-01-25' },
    { id: 14, firstName: 'Liam', lastName: 'Nguyen', email: 'liam@example.com', phoneNumber: '987-654-3210', address: '234 Elm Ave', postalCode: '32109', city: 'Cityville', membershipType: 'Junior', memberSince: '2023-02-05' },
    { id: 15, firstName: 'Mia', lastName: 'Olsen', email: 'mia@example.com', phoneNumber: '444-555-6666', address: '123 Maple St', postalCode: '21098', city: 'Villagetown', membershipType: 'Full', memberSince: '2023-03-10' },
    { id: 16, firstName: 'Noah', lastName: 'Patel', email: 'noah@example.com', phoneNumber: '777-888-9999', address: '456 Oak Ave', postalCode: '10987', city: 'Townsville', membershipType: 'Junior', memberSince: '2023-04-15' },
    
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
