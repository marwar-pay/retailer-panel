import { useState, useEffect } from 'react';
import { Typography, TextField, Button, Grid, Avatar, Alert } from '@mui/material';
import Profile from './Profile';
import { apiGet, apiPost } from '../../../api/apiMethods';


const EditProfile = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({}); 
  const [isLoading, setIsLoading] = useState(true);
 
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('success');
  const API_ENDPOINT = `apiUser/v1/userRoute/userInfo`;


  useEffect(() => {
    apiGet(API_ENDPOINT)
      .then(response => {
        setUserData(response.data.data);
        setFormData({
          fullName: response.data.data.fullName || '', 
          mobileNumber: response.data.data.mobileNumber || '',
          email: response.data.data.email || '' 
        });
        setIsLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the user data!', error);
        setAlertMessage('Unable to load user data. Please try again later.');
        setAlertType('error');
        setIsLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value })); // Dynamically update formData
  };

  const [showEditProfile, setShowEditProfile] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
   

    try {
      const response = await apiPost(`apiUser/v1/userRoute/updateProfile`, formData);

      if (response.status === 200) {
        setAlertMessage('Profile updated successfully');
        setAlertType('success');
        
        // Instead of navigating, set the flag to show the EditProfile component
        setShowEditProfile(true);
      } else {
        setAlertMessage('Failed to update profile.');
        setAlertType('error');
      }
    } catch (error) {
      console.error('Error updating profile', error);
      setAlertMessage('An error occurred while updating the profile.');
      setAlertType('error');
    }
  };

  // Conditionally render EditProfile component based on showEditProfile state
  if (showEditProfile) {
    return <Profile />;
  }

  if (isLoading || !userData) {
    return (
      <Typography variant="h6">
        {isLoading ? 'Loading...' : 'Unable to load user data. Please try again later.'}
      </Typography>
    );
  }
  

  const profileImage = userData.profileImage;
  const userInitials = userData.fullName ? userData.fullName.split(' ').map(name => name[0]).join('') : '';

  return (
    <>
   
        <Typography variant="h5" gutterBottom sx={{paddingTop:'20px'}}>Edit Profile</Typography>

        {alertMessage && (
          <Alert severity={alertType} sx={{ mb: 2 }}>
            {alertMessage}
          </Alert>
        )}

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4} container justifyContent="center">
            <Avatar
              alt={userData.fullName}
              src={profileImage || ''}
              sx={{ width: 100, height: 100, bgcolor: profileImage ? 'transparent' : 'grey[500]' }}
            >
              {!profileImage && userInitials}
            </Avatar>
          </Grid>
          <Grid item xs={12} md={8}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName || ''} // Ensure it defaults to an empty string
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobileNumber"
                    value={formData.mobileNumber || ''} // Ensure it defaults to an empty string
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={userData.userName || ''}
                    variant="outlined"
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email || ''} // Use the email from formData
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button variant="contained" color="primary" type="submit">
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
     
    </>
  );
};

export default EditProfile;
