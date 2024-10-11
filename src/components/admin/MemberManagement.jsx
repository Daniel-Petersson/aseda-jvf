import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, TablePagination, Modal, Button, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllMembers, updateMember } from '../../services/MemberService';
import MemberForm from '../common/MemberForm';

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      const result = await getAllMembers();
      if (result.success) {
        setMembers(result.data);
      } else {
        console.error(result.error);
      }
    };
    fetchMembers();
  }, []);

  const handleEditClick = (member) => {
    setSelectedMember(member);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedMember(null);
  };

  const handleSave = (updatedMember) => {
    setSelectedMember(updatedMember);
    setConfirmDialogOpen(true);
  };

  const confirmSave = async () => {
    try {
      const result = await updateMember(selectedMember.id, selectedMember);
      if (result.success) {
        setSnackbarMessage('Ändringarna sparades framgångsrikt!');
        const updatedMembers = members.map((member) =>
          member.id === selectedMember.id ? result.data : member
        );
        setMembers(updatedMembers);
      } else {
        setSnackbarMessage('Ett fel uppstod vid sparandet av ändringarna.');
      }
      setConfirmDialogOpen(false);
      setOpenModal(false);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating member:', error);
      setError('Ett oväntat fel inträffade. Vänligen försök igen.');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
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
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Förnamn</TableCell>
              <TableCell>Efternamn</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Adress</TableCell>
              <TableCell>Postnummer</TableCell>
              <TableCell>Stad</TableCell>
              <TableCell>Roll</TableCell>
              <TableCell>Skapad Datum</TableCell>
              <TableCell>Uppdaterad Datum</TableCell>
              <TableCell>Medlemskap Betald Till</TableCell>
              <TableCell>Aktiv</TableCell>
              <TableCell>Åtgärder</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.id}</TableCell>
                <TableCell>{member.firstName}</TableCell>
                <TableCell>{member.lastName}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{member.address}</TableCell>
                <TableCell>{member.postalCode}</TableCell>
                <TableCell>{member.city}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.dateCreated}</TableCell>
                <TableCell>{member.dateUpdated || 'N/A'}</TableCell>
                <TableCell>{member.membershipPaidUntil || 'N/A'}</TableCell>
                <TableCell>{member.active ? 'Ja' : 'Nej'}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit" onClick={() => handleEditClick(member)}>
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
      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            p: 4,
            bgcolor: 'background.paper',
            margin: 'auto',
            mt: 5,
            maxWidth: { xs: '90%', sm: 500, md: 600, lg: 700 },
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          {selectedMember && (
            <MemberForm
              initialData={selectedMember}
              onSubmit={handleSave}
              isEditing={true}
              submitButtonText="Spara ändringar"
            />
          )}
          <Button variant="outlined" color="primary" onClick={handleModalClose} sx={{ mt: 2 }}>
            Avbryt
          </Button>
        </Box>
      </Modal>
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Bekräfta sparning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Är du säker på att du vill spara ändringarna?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Avbryt
          </Button>
          <Button onClick={confirmSave} color="primary" autoFocus>
            Bekräfta
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={null}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        sx={{ width: '80%', maxWidth: 400 }}
        action={
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button color="secondary" size="small" onClick={confirmSave}>
              BEKRÄFTA
            </Button>
            <Button color="secondary" size="small" onClick={handleSnackbarClose}>
              AVBRYT
            </Button>
          </Box>
        }
      >
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MemberManagement;