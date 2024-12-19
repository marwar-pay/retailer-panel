import { useState } from 'react';
import { Typography, TextField, Button, Grid, Alert,  } from '@mui/material';
import { apiPost } from '../../../api/apiMethods';


const ChangeTransactionPassword = () => {
  // Initialize formData as an empty object
  const [formData, setFormData] = useState({
    currentPassword: '',
    trxPassword: '',
    confirmTrxPassword: '',
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('success');


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.trxPassword !== formData.confirmTrxPassword) {
      setAlertMessage('Transaction passwords do not match.');
      setAlertType('error');
      return;
    }

    try {
      const response = await apiPost(
        `apiUser/v1/userRoute/updateTrxPassword`,
        {
          currentPassword: formData.currentPassword,
          trxPassword: formData.trxPassword,
        },
      );

      if (response.status === 200) {
        setAlertMessage('Transaction password updated successfully.');
        setAlertType('success');
      } else {
        setAlertMessage('Failed to update transaction password.');
        setAlertType('error');
      }
    } catch (error) {
      console.error('Error updating transaction password', error);
      setAlertMessage('Old Password Not Matched Please Try Again.');
      setAlertType('error');
    }
  };

  return (
    <>
      {alertMessage && (
        <Alert severity={alertType} sx={{ mb: 2 }}>
          {alertMessage}
        </Alert>
      )}

     
            <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>
              Change Transaction Password
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Current Password */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    required
                  />
                </Grid>

                {/* New Transaction Password */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Transaction Password"
                    name="trxPassword"
                    type="password"
                    value={formData.trxPassword}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    required
                  />
                </Grid>

                {/* Confirm New Transaction Password */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm New Transaction Password"
                    name="confirmTrxPassword"
                    type="password"
                    value={formData.confirmTrxPassword}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    required
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" type="submit">
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </form>
      
    </>
  );
};

export default ChangeTransactionPassword;
