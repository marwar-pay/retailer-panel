import { Grid, Paper } from '@mui/material';
import ChangeTransactionPassword from './Trxchange';
import ChangePassworduser from './PasswordChange';

const ChangePassword = () => {
  return (
    <>
      <Grid container spacing={3} alignItems="center" sx={{paddingTop:'20px'}}>
    <Grid item xs={12} md={6}>
        <Paper sx={{ padding: 4 }}>
          <ChangePassworduser/>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
        <Paper sx={{ padding: 4 }}>
          <ChangeTransactionPassword/>
          </Paper>
        </Grid>
        </Grid>
    </>
  );
};

export default ChangePassword;
