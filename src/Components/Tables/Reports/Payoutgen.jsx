import { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Grid, Pagination, useMediaQuery } from '@mui/material';


import { apiGet } from '../../../api/apiMethods';

const Payoutgen = () => {
  const isFirstRender = useRef(true);

  const [payoutData, setPayoutData] = useState([]); // Ensure initial value is an empty array
  const [filteredData, setFilteredData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const [totalDocs, setTotalDocs] = useState(Number);
  const [totalPages, setTotalPages] = useState(Number);
  const API_ENDPOINT = `apiUser/v1/payout/getAllPayOutGenerated`;
  const isSmallScreen = useMediaQuery('(max-width:800px)');
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async (exportCSV = "false") => {
    try {
      if ((searchStartDate && !searchEndDate) || (!searchStartDate && searchEndDate)) return;
      const response = await apiGet(`${API_ENDPOINT}?page=${currentPage}&limit=${itemsPerPage}&keyword=${searchInput}&startDate=${searchStartDate}&endDate=${searchEndDate}&export=${exportCSV}`);
  
      if (exportCSV === 'true') {
        const blob = new Blob([response.data], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `payment-generate${searchStartDate}-${searchEndDate}.csv`;
        link.click();
        link.remove();
        return;
      }
  
      // Ensure response.data.data is an array, or fall back to an empty array
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      
      if (data.length === 0) {
        setPayoutData([]);
        setFilteredData([]);
        setIsLoading(false);
      } else {
        setPayoutData(data);
        setFilteredData(data);
        setIsLoading(false);
      }
  
      setTotalDocs(response.data.totalDocs || 0);
    } catch (error) {
      console.error('There was an error fetching the payout data!', error);
      setPayoutData([]); // Ensure UI updates to "No data available"
      setFilteredData([]);
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();
    const totalPages = Math.ceil(totalDocs / itemsPerPage)
    setTotalPages(totalPages);
  }, [currentPage, itemsPerPage, searchStartDate, searchEndDate,totalDocs]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      fetchData();
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchInput]);






  const handleReset = () => {
    setSearchInput(''); // Reset TxnID search input
    setSearchStartDate('');
    setSearchEndDate(''); // Reset end date
    setFilteredData(payoutData);
    setCurrentPage(1); // Reset to first page
   
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };



  return (
    <div>
      <Grid sx={{
        mb: 3,
        paddingTop: '20px',
        position: isSmallScreen ? 'relative' : 'sticky', // Remove sticky for small screens
        top: isSmallScreen ? 'auto' : 0,
        zIndex: 1000,
        overflow: 'hidden',
        backgroundColor: 'white',
      }} className='setdesigntofix'>
        <Grid container alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs>
            <Typography variant="h5" gutterBottom>Payout Generate Information</Typography>
          </Grid>
          <Button variant="contained" onClick={() => fetchData("true")}>
            Export
          </Button>
        </Grid>

        <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Search by TxnID" // Update label
              variant="outlined"
              fullWidth
              value={searchInput} // Bind to searchInput state
              onChange={(e) => setSearchInput(e.target.value)} // Update searchInput and trigger filtering
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Start Date"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={searchStartDate}
              onChange={(e) => setSearchStartDate(e.target.value)} // Update start date and trigger filtering
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="End Date"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={searchEndDate}
              onChange={(e) => setSearchEndDate(e.target.value)} // Update end date and trigger filtering
            />
          </Grid>
          <Grid item xs={12} sm={3} container spacing={1}>
            <Grid item xs={6}>
              <Button variant="outlined" fullWidth onClick={handleReset}>
                Reset
              </Button>
            </Grid>
            {/* <Grid item xs={6}>
              <Button variant="contained" fullWidth onClick={toggleViewAll}>
                {viewAll ? 'Paginate' : 'View All'}
              </Button>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
      <div>
      <TableContainer
        component={Paper}
        sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', p: 1 }}
      >
        <Table sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
              <TableRow>
                <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>#</strong></TableCell>
                <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Name</strong></TableCell>
                <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>TxnID</strong></TableCell>
                <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Amount</strong></TableCell>
                <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Account No.</strong></TableCell>
                <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>IFSC Code</strong></TableCell>
                <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Status</strong></TableCell>
                <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Date</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

            {isLoading ? (
    <TableRow>
      <TableCell colSpan={6} align="center">
        Loading...
      </TableCell>
    </TableRow>
  ) : filteredData.length === 0 ? (
    <TableRow>
      <TableCell colSpan={6} align="center">
        No data available.
      </TableCell>
    </TableRow>
  ) : (
                    filteredData.map((payout, index) => (
                  <TableRow key={payout._id}>
                    <TableCell>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{payout.accountHolderName || 'NA'}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{payout.trxId || 'NA'}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{Number(payout.amount || 'NA').toFixed(2)}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{payout.accountNumber || 'NA'}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{payout.ifscCode || 'NA'}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', color: payout.isSuccess === 'Success' ? 'green' : 'red' }}>{payout.isSuccess || 'NA'}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                      {new Date(payout.createdAt).toLocaleString()}
                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} variant="outlined" shape="rounded" />
      </Grid>
      </div>

    </div>
  );
};

export default Payoutgen;
