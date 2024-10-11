import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Grid, Box, Typography, Select, MenuItem } from '@mui/material';
import { AuthContext } from '../../utils/AuthContext'; // Importera AuthContext

const MemberForm = ({ onSubmit, initialData, isEditing, submitButtonText, isRegistration }) => {
  const { user } = useContext(AuthContext); // Använd AuthContext
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    //role: '', //ändra denna toll optional i MemberDtoForm för att den inte ska krävas när man registrerar
    dateCreated: '',
    dateUpdated: '',
    membershipPaidUntil: '',
    active: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        password: '',
        confirmPassword: '',
      });
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isRegistration) {
      // Prepare MemberDtoForm
      const { confirmPassword, dateCreated, dateUpdated, membershipPaidUntil, active, ...memberDtoForm } = formData;
      onSubmit(memberDtoForm);
    } else {
      // Prepare MemberUpdateDtoForm
      const { confirmPassword, ...memberUpdateDtoForm } = formData;
      onSubmit(memberUpdateDtoForm);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {[
          { name: "firstName", label: "Förnamn", autoComplete: "given-name" },
          { name: "lastName", label: "Efternamn", autoComplete: "family-name" },
          { name: "address", label: "Adress", autoComplete: "street-address" },
          { name: "postalCode", label: "Postnummer", autoComplete: "postal-code" },
          { name: "city", label: "Postort", autoComplete: "address-level2" },
          { name: "phone", label: "Telefon", autoComplete: "tel" },
          { name: "email", label: "E-post", type: "email", autoComplete: "username" },
          ...(user && user.role === 'ADMIN' ? [
            { name: "role", label: "Roll", autoComplete: "role" },
            { name: "dateCreated", label: "Skapad Datum", type: "date" },
            { name: "dateUpdated", label: "Uppdaterad Datum", type: "date" },
            { name: "membershipPaidUntil", label: "Medlemskap Betald Till", type: "date" },
            { name: "active", label: "Aktiv", type: "checkbox" },
          ] : []),
          { name: "password", label: "Lösenord", type: "password", autoComplete: "new-password" },
          { name: "confirmPassword", label: "Bekräfta lösenord", type: "password", autoComplete: "new-password" },
        ].map((field) => (
          <Grid item xs={12} sm={field.name === "postalCode" || field.name === "city" ? 6 : 12} key={field.name}>
            {field.name === "role" ? (
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="ADMIN">ADMIN</MenuItem>
                <MenuItem value="INSTRUCTOR">INSTRUCTOR</MenuItem>
                <MenuItem value="USER">USER</MenuItem>
              </Select>
            ) : (
              <TextField
                name={field.name}
                label={field.label}
                variant="outlined"
                fullWidth
                required={field.name !== "phone"}
                type={field.type || "text"}
                value={formData[field.name]}
                onChange={handleChange}
                disabled={!isEditing}
                autoComplete={field.autoComplete}
              />
            )}
          </Grid>
        ))}
      </Grid>
      {isEditing && (
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          size="large"
          sx={{ mt: 3 }}
        >
          {submitButtonText}
        </Button>
      )}
    </Box>
  );
};

export default MemberForm;