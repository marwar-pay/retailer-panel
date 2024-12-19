import { useState } from 'react';
import { Typography, TextField, Button, Grid, Alert } from '@mui/material';
import { apiPost } from '../../../api/apiMethods';



const ChangePassworduser = () => {
  // Initialize formData as an empty object
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('success');

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setAlertMessage('New passwords do not match.');
      setAlertType('error');
      return;
    }

    try {
      const response = await apiPost(
        `apiUser/v1/userRoute/updatePassword`,
        {
          currentPassword: formData.currentPassword,
          password: formData.newPassword,
        },
        
      );

      if (response.status === 200) {
        setAlertMessage('Password updated successfully.');
        setAlertType('success');
      } else {
        setAlertMessage('Failed to update password.');
        setAlertType('error');
      }
    } catch (error) {
      console.error('Error updating password', error);
      setAlertMessage('Old Password Not Matched Please Try Again.');
      setAlertType('error');
    }
  };

  return(  
    <>
  {alertMessage && (
        <Alert severity={alertType} sx={{ mb: 2 }}>
          {alertMessage}
        </Alert>
      )}

     
            <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>
              Change Password
            </Typography>
     
   
    
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Old Password */}
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

                {/* New Password */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    required
                  />
                </Grid>

                {/* Confirm New Password */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
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

export default ChangePassworduser;
