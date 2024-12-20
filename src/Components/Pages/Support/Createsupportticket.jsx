import { useState } from 'react';
import {Box, Typography, TextField, Button, Snackbar, Alert, Select, MenuItem, Grid } from '@mui/material';
import ViewTicket from '../../Tables/Support/Viewticket';
import { apiPost } from '../../../api/apiMethods';


const CreateTicket = () => {
  
 
  const [formData, setFormData] = useState({}); // Initialize as an empty object
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const API_ENDPOINT = `apiUser/v1/support/addSupportTicket`;

  const [showviewTicket, setShowViewTicket] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value })); // Dynamically update the formData
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiPost(API_ENDPOINT, formData);
      console.log('Ticket created successfully:', response.data);
      setOpenSnackbar(true);
      setTimeout(() => {
        setShowViewTicket(true);
      }, 2000);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized access. Redirecting to login.');
        window.location.href = '/login';
      } else {
        setError('An error occurred. Please try again.');
        console.error('Error:', error);
      }
    }
  };
  if (showviewTicket) {
    return <ViewTicket />;
  }

  return (
    <>
    <Grid sx={{
    mb: 3,
    position: 'sticky', 
    top: 0,             
    zIndex: 1000, 
    paddingTop:'20px',
    overflow:'hidden' ,     
    backgroundColor: 'white', 
  }} className='setdesigntofix'>
     <Grid container alignItems="center" sx={{ mb: 2 , fontWeight:'bold'}}>
        <Grid item xs>
          <Typography variant="h5" gutterBottom>Create Support Ticket</Typography>
        </Grid>
      </Grid>
      </Grid>
      <Box
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'background.paper',
          position: 'relative',
        }}
      >
  

        {error && <Typography color="error">{error}</Typography>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject || ''} // Ensure it defaults to an empty string
                onChange={handleChange}
                margin="dense"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Select
  fullWidth
  name="relatedTo"
  value={formData.relatedTo || 'Select Related To'} // Set default to "Payin"
  onChange={handleChange}
  margin="dense"
  required
>
  <MenuItem value="Select Related To" disabled>Select Related To</MenuItem>
  <MenuItem value="Payin">Payin</MenuItem>
  <MenuItem value="Payout">Payout</MenuItem>
  <MenuItem value="Request">Request</MenuItem>
  <MenuItem value="Feedback">Feedback</MenuItem>
</Select>
</Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                name="message"
                value={formData.message || ''} // Ensure it defaults to an empty string
                onChange={handleChange}
                margin="dense"
                multiline
                rows={4}
                required
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="success">
            Ticket created successfully!
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default CreateTicket;
