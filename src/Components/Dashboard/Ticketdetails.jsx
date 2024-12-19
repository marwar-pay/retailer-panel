import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, AppBar, Toolbar } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';


import CountUp from 'react-countup';
import ticket from "../../assets/images/ticket.png";
import { apiGet } from '../../api/apiMethods';


const COLORS = ['#8884d8', '#82ca9d', '#FF8042'];

const Ticketdetails = () => {
  const [ticketData, setTicketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const API_ENDPOINT = `apiUser/v1/support/getSupportTicket`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGet(API_ENDPOINT);
        setTicketData(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pieData = ticketData.length ? [
    { name: 'Pending', value: ticketData.filter(ticket => ticket.isStatus === 'Pending').length || 0 },
    { name: 'Resolved', value: ticketData.filter(ticket => ticket.isStatus === 'Resolved').length || 0 },
    { name: 'Rejected', value: ticketData.filter(ticket => ticket.isStatus === 'Rejected').length || 0 },
  ] : [
    { name: 'Pending', value: 0 },
    { name: 'Resolved', value: 0 },
    { name: 'Rejected', value: 0 },
  ];

  return (
    <Box sx={{ flexGrow: 1,marginTop:'15px',paddingTop:'30px' }}>
      {/* AppBar */}
      <AppBar position="static" sx={{borderRadius:'10px',background: 'linear-gradient(45deg, #00000073, #2196f3a3) !important',}}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Support Ticket 
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Grid Layout for Cards and Graphs */}
      <Grid container spacing={3} sx={{ padding: 1,marginTop:0.5,marginBottom:3}}>
        {/* Ticket Status Overview with Circular Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper className="clrchnge"  sx={{ 
            padding: 2, 
            borderRadius: 2, 
            boxShadow: 3, 
            background: 'linear-gradient(to right, #f9f9f9, #e0e0e0)', 
            '&:hover': { 
              transform: 'scale(1.02)', 
              transition: 'transform 0.2s ease-in-out' 
            } 
          }}>
            <Typography variant="h6" gutterBottom>Ticket Status Overview</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  label
                  innerRadius={60}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
            {ticketData.length === 0 && (
              <Typography align="center" sx={{ mt: 2 }}>No Data Available</Typography>
            )}
          </Paper>
        </Grid>

        {/* Ticket Counts */}
        <Grid item xs={12} md={6} container spacing={3}>
          <Grid item xs={12}>
            <Paper className="clrchnge"  sx={{ 
              padding: 2, 
              borderRadius: 2, 
              boxShadow: 3, 
              textAlign:'center', 
              background: 'linear-gradient(to right, #f9f9f9, #e0e0e0)', 
              '&:hover': { 
                transform: 'scale(1.02)', 
                transition: 'transform 0.2s ease-in-out',
              } 
            }}>
              <Grid container spacing={3} sx={{ padding: 0 }}>
              <Grid item xs={8}>
              <Typography variant="h6">Total Pending Tickets</Typography>
              <Typography variant="body1">
                <CountUp end={pieData[0].value} duration={2.5} />
              </Typography>
              </Grid>
              <Grid item xs={4}>
<img src={ticket} style={{width:'50%'}}></img>
              </Grid>
             
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className="clrchnge"  sx={{ 
              padding: 2, 
              borderRadius: 2, 
              boxShadow: 3, 
              textAlign:'center', 
              background: 'linear-gradient(to right, #f9f9f9, #e0e0e0)', 
              '&:hover': { 
                transform: 'scale(1.02)', 
                transition: 'transform 0.2s ease-in-out',
              } 
            }}>
              <Grid container spacing={3} sx={{ padding: 0 }}>
              <Grid item xs={8}>
              <Typography variant="h6">Total Resolved Tickets</Typography>
              <Typography variant="body1">
                <CountUp end={pieData[1].value} duration={2.5} />
              </Typography>
              </Grid>
              <Grid item xs={4}>
<img src={ticket} style={{width:'50%'}}></img>
              </Grid>
             
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className="clrchnge"  sx={{ 
              padding: 2, 
              borderRadius: 2, 
              boxShadow: 3, 
              textAlign:'center', 
              background: 'linear-gradient(to right, #f9f9f9, #e0e0e0)', 
              '&:hover': { 
                transform: 'scale(1.02)', 
                transition: 'transform 0.2s ease-in-out',textAlign:'center', 
              } 
            }}>
              <Grid container spacing={3} sx={{ padding: 0 }}>
              <Grid item xs={8}>
              <Typography variant="h6">Total Rejected Tickets</Typography>
              <Typography variant="body1">
                <CountUp end={pieData[2].value} duration={2.5} />
              </Typography>
              </Grid>
              <Grid item xs={4}>
<img src={ticket} style={{width:'50%'}}></img>
              </Grid>
             
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Ticketdetails;
