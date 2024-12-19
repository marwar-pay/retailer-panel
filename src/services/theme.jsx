// src/services/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#d32f2f',
    },
  },
  // typography: {
  //   fontFamily: 'Roboto, Arial, sans-serif',
  // },
  typography: {
    fontFamily: "'Kanit', sans-serif !important",
  },
  
});

export default theme;


