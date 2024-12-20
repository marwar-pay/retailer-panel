import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Grid,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  useMediaQuery
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

import CreateTicket from '../../Pages/Support/Createsupportticket';
import { saveAs } from 'file-saver';
import { apiGet } from '../../../api/apiMethods';

const ViewTicket = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ticketData, setTicketData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchTicketID, setSearchTicketID] = useState('');
  const [page, setPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const itemsPerPage = 10;
  const isSmallScreen = useMediaQuery('(max-width:800px)');

  const API_ENDPOINT = `apiUser/v1/support/getSupportTicket`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGet(API_ENDPOINT);
        setTicketData(response.data.data);
        setFilteredData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('There was an error fetching the ticket data!', error);
        setIsLoading(false);
      }
    };

    // Fetch data initially
    fetchData();
  }, []);

  useEffect(() => {
    handleFilter(); // Call handleFilter when search inputs change
  }, [searchDate, searchStatus, searchTicketID]);

  const handleFilter = () => {
    let filtered = ticketData;

    if (searchDate) {
      const filterDate = new Date(searchDate).toISOString().split('T')[0];
      filtered = filtered.filter(
        ticket => new Date(ticket.createdAt).toISOString().split('T')[0] === filterDate
      );
    }

    if (searchStatus) {
      filtered = filtered.filter(ticket => ticket.isStatus === searchStatus);
    }

    if (searchTicketID) {
      filtered = filtered.filter(ticket =>
        ticket.TicketID.toLowerCase().includes(searchTicketID.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setPage(1); // Reset to first page
  };

  const handleReset = () => {
    setSearchDate('');
    setSearchStatus('');
    setSearchTicketID('');
    setFilteredData(ticketData);
    setPage(1); // Reset to first page
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleModal = (ticket = null) => {
    setSelectedTicket(ticket);
    setOpenModal(!!ticket);
  };

  if (isLoading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  const handleViewAll = () => {
    setFilteredData(ticketData);
    setPage(1); // Reset to first page
  };

  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (isEditing) {
    return <CreateTicket />;
  }

  const handleExportData = () => {
    const dateFormatter = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Set to true if you want 12-hour format
    });
  
    const csvRows = [
      ['#','Ticket ID', 'Subject', 'Related To', 'Status','Date'], 
      ...filteredData.map((item, index) => [
        index + 1,
        item.TicketID || 'NA',
        item.subject || 'NA',
        item.relatedTo || 'NA',
        item.isStatus || 'NA',
        dateFormatter.format(new Date(item.createdAt)),
      ]),
    ];
  
    const csvContent = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Tickets.csv');
  };

  return (
    <>
 <Grid sx={{
    mb: 3,
    position: isSmallScreen ? 'relative' : 'sticky', // Remove sticky for small screens
    top: isSmallScreen ? 'auto' : 0,            
    zIndex: 1000, 
    paddingTop:'20px',
    overflow:'hidden' ,     
    backgroundColor: 'white', 
  }} className='setdesigntofix'>
      <Grid container alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs>
          <Typography variant="h5" gutterBottom>
            Ticket Information
          </Typography>
        </Grid>
        <Button variant="contained" onClick={handleExportData}>
            Export 
          </Button>
      </Grid>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search by Ticket ID"
            variant="outlined"
            fullWidth
            value={searchTicketID}
            onChange={(e) => setSearchTicketID(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Search by Date"
            type="date"
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            select
            label="Filter by Status"
            variant="outlined"
            fullWidth
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" onClick={handleViewAll} fullWidth>
            View All
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button variant="outlined" onClick={handleReset} fullWidth>
            Reset
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" color="primary" onClick={() => setIsEditing(true)} fullWidth>
            Create Ticket
          </Button>
        </Grid>
      </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', p: 1 }}>
      <Table sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px'}}><strong>#</strong></TableCell>
              <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Ticket ID</strong></TableCell>
              <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Subject</strong></TableCell>
              <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Related To</strong></TableCell>
              <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Status</strong></TableCell>
              <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Date</strong></TableCell>
              <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="h6">No data found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((ticket, index) => (
                <TableRow key={ticket._id}>
                  <TableCell sx={{  border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px'}}>
                    {(page - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                    {ticket.TicketID}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px'}}>
                    {ticket.subject}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px'}}>
                    {ticket.relatedTo}
                  </TableCell>
                  <TableCell
                    sx={{
                       border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px',
                      color: ticket.isStatus === 'Rejected'
                        ? 'orange'
                        : ticket.isStatus === 'Pending'
                        ? 'red'
                        : ticket.isStatus === 'Resolved'
                        ? 'green'
                        : 'black',
                      fontWeight: 500,
                    }}
                  >
                    {ticket.isStatus}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                    {new Date(ticket.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                    <IconButton onClick={() => handleModal(ticket)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container justifyContent="center" sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Pagination
          count={Math.ceil(filteredData.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Grid>

      <Dialog open={openModal} onClose={() => handleModal(null)} maxWidth="md" fullWidth>
        <DialogTitle>Ticket Details</DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Field</strong></TableCell>
                    <TableCell><strong>Details</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Ticket ID</strong></TableCell>
                    <TableCell>{selectedTicket.TicketID}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Subject</strong></TableCell>
                    <TableCell>{selectedTicket.subject}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Related To</strong></TableCell>
                    <TableCell>{selectedTicket.relatedTo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Message</strong></TableCell>
                    <TableCell>{selectedTicket.message}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell>{selectedTicket.isStatus}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Created At</strong></TableCell>
                    <TableCell>{new Date(selectedTicket.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                  
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleModal(null)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewTicket;
