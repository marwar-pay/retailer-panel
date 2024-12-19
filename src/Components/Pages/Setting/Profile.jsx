import { useState, useEffect } from 'react';
import { Paper, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Avatar } from '@mui/material';
import EditProfile from './EditProfile'; 
import { apiGet } from '../../../api/apiMethods';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 
  const API_ENDPOINT = 'apiUser/v1/userRoute/userInfo';

  useEffect(() => {
    apiGet(API_ENDPOINT)
      .then(response => {
        setUserData(response.data.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the user data!', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading || !userData) {
    return (
      <Typography variant="h6">
        {isLoading 
          ? "Loading..." 
          : "Unable to load user data. Please try again later."}
      </Typography>
    );
  }

  const {
    fullName, userName, email, mobileNumber, memberId, memberType,
    addresh, minWalletBalance, upiWalletBalance, EwalletBalance, createdAt, isActive
  } = userData;

  const userInitial = fullName ? fullName.charAt(0).toUpperCase() : '';

  // Conditionally render EditProfile component if editing, otherwise render Profile
  if (isEditing) {
    return <EditProfile />; // Render the EditProfile component when editing
  }

  return (
    <>
      <Grid container spacing={3} sx={{paddingTop:'20px'}}>
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>Profile Information</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Field</strong></TableCell>
                  <TableCell><strong>Value</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>{fullName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>{userName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>{email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mobile Number</TableCell>
                  <TableCell>{mobileNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Member ID</TableCell>
                  <TableCell>{memberId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Member Type</TableCell>
                  <TableCell>{memberType}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>Account Details</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Field</strong></TableCell>
                  <TableCell><strong>Value</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>{addresh?.addresh}{addresh?.street}, {addresh?.city}, {addresh?.state}, {addresh?.country} - {addresh?.pincode}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Min Wallet Balance</TableCell>
                  <TableCell>{minWalletBalance}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>UPI Wallet Balance</TableCell>
                  <TableCell>{upiWalletBalance}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>E-wallet Balance</TableCell>
                  <TableCell>{EwalletBalance}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Account Active</TableCell>
                  <TableCell>{isActive ? 'Yes' : 'No'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Created At</TableCell>
                  <TableCell>{new Date(createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={4} container direction="column" alignItems="center">
          <Avatar
            alt={fullName}
            sx={{ width: 150, height: 150, mb: 2, bgcolor: 'grey.300', color: 'grey.800' }}
          >
            {userInitial}
          </Avatar>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsEditing(true)}  // Set editing mode
          >
            Edit Profile
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
