import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const MemberForm = ({ initialData, onSubmit, isProfile = false }) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);

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
    if (isProfile) {
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Box component="form" noValidate autoComplete="off" mt={3} onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* TextField components */}
        {[ 
          { name: "firstName", label: "Förnamn" },
          { name: "lastName", label: "Efternamn" },
          { name: "address", label: "Adress" },
          { name: "postalCode", label: "Postnummer" },
          { name: "city", label: "Postort" },
          { name: "phone", label: "Telefon" },
          { name: "email", label: "E-post", type: "email" },
          { name: "password", label: "Lösenord", type: "password" },
          { name: "confirmPassword", label: "Bekräfta lösenord", type: "password" },
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
              InputProps={{ 
                readOnly: isProfile && !isEditing,
              }}
            />
          </Grid>
        ))}
      </Grid>
      {isProfile ? (
        <Box mt={3}>
          {isEditing ? (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              size="large"
            >
              Spara ändringar
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEdit}
              fullWidth
              size="large"
            >
              Redigera uppgifter
            </Button>
          )}
        </Box>
      ) : (
        <Box mt={3}>
          <Typography variant="body2" gutterBottom>
            Medlemsavgift:
          </Typography>
          <Typography variant="body2" gutterBottom>
            • 300:- för senior
          </Typography>
          <Typography variant="body2" gutterBottom>
            • 50:- för junior / under 18 år
          </Typography>
          <Typography variant="body2" gutterBottom>
            Glöm inte att sätta in pengarna på bg 5176-9123, eller SWISH 1232302529.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
          >
            Bli medlem
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MemberForm;