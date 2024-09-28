import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';

const MemberForm = ({ onSubmit, initialData, isEditing, submitButtonText }) => {
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
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        address: initialData.address || '',
        postalCode: initialData.postalCode || '',
        city: initialData.city || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
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
          { name: "password", label: "Lösenord", type: "password", autoComplete: "new-password" },
          { name: "confirmPassword", label: "Bekräfta lösenord", type: "password", autoComplete: "new-password" },
        ].map((field) => (
          <Grid item xs={12} sm={field.name === "postalCode" || field.name === "city" ? 6 : 12} key={field.name}>
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