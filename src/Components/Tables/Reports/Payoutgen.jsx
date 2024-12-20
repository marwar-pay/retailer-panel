import { useState, useEffect } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Grid, Pagination, useMediaQuery } from '@mui/material';
import { saveAs } from 'file-saver';
import { apiGet } from '../../../api/apiMethods';

const Payoutgen = () => {

  const [payoutData, setPayoutData] = useState([]); // Ensure initial value is an empty array
  const [filteredData, setFilteredData] = useState([]);
  const [searchTxnID, setSearchTxnID] = useState('');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const itemsPerPage = 10;
  const API_ENDPOINT = `apiUser/v1/payout/getAllPayOutGenerated`;
  const isSmallScreen = useMediaQuery('(max-width:800px)');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGet(API_ENDPOINT);
        // Ensure response.data.data is an array, or fall back to an empty array
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        setPayoutData(data);
        setFilteredData(data);

      } catch (error) {
        console.error('There was an error fetching the payout data!', error);
  
      }
    };

    fetchData();
  }, []);
  const handleFilter = () => {
    if (!Array.isArray(payoutData)) {
      console.warn("payoutData is not an array:", payoutData); // Add warning for debugging
      setFilteredData([]); // Reset filtered data to empty if payoutData is not an array
      return;
    }
  
    let filtered = payoutData.filter(item => {
      const matchesTxnID = item.trxId.toLowerCase().includes(searchTxnID.toLowerCase());
  
      const trxDate = new Date(item.createdAt);
      trxDate.setHours(0, 0, 0, 0); // Normalize to midnight for accurate date comparison
  
      const startDate = searchStartDate ? new Date(searchStartDate) : null;
      const endDate = searchEndDate ? new Date(searchEndDate) : null;
  
      if (startDate) startDate.setHours(0, 0, 0, 0);
      if (endDate) endDate.setHours(23, 59, 59, 999); // Inclusive of the entire end day
  
      const isStartDateOnly = startDate && !endDate && trxDate.getTime() === startDate.getTime();
      const isWithinDateRange = startDate && endDate && trxDate >= startDate && trxDate <= endDate;
  
      // If no dates are selected, filter only by TxnID
      if (!startDate && !endDate) {
        return matchesTxnID;
      }
  
      // Otherwise, filter by TxnID and date conditions
      return matchesTxnID && (isStartDateOnly || isWithinDateRange);
    });
  
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page when filtering
  };
  
  useEffect(() => {
    handleFilter(); // Call filter function on state changes
  }, [searchTxnID, searchStartDate, searchEndDate, payoutData]);
  



  const handleReset = () => {
    setSearchTxnID(''); // Reset TxnID search input
    setSearchStartDate('');
    setSearchEndDate(''); // Reset end date
    setFilteredData(payoutData);
    setCurrentPage(1); // Reset to first page
    setViewAll(false);

  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


  const toggleViewAll = () => {
    setViewAll((prev) => !prev);
    setCurrentPage(1);
    
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = viewAll
    ? filteredData
    : Array.isArray(filteredData)
    ? filteredData.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
      ['#', 'Name','TxnID','Amount', 'Account No.', 'IFSC Code', 'Status','Date'], 
      ...filteredData.map((item, index) => [
        index + 1,
        item.accountHolderName || 'NA',
        item.trxId || 'NA',
        item.amount || 'NA',
        item.accountNumber || 'NA',
        item.ifscCode || 'NA',
        item.isSuccess || 'NA',
        dateFormatter.format(new Date(item.createdAt)),
      ]),
    ];
  
    const csvContent = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Pay_Out_Data.csv');
  };

  return (
    <div>
       <Grid sx={{
    mb: 3,
    paddingTop:'20px',
    position: isSmallScreen ? 'relative' : 'sticky', // Remove sticky for small screens
    top: isSmallScreen ? 'auto' : 0,             
    zIndex: 1000,  
    overflow:'hidden' ,      
    backgroundColor: 'white', 
      }} className="setdesigntofix">

      <Grid container alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs>
          <Typography variant="h5" gutterBottom>Payout Generate Information</Typography>
        </Grid>
        <Button variant="contained" onClick={handleExportData}>
            Export
          </Button>
      </Grid>

      <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Search by TxnID" // Update label
            variant="outlined"
            fullWidth
            value={searchTxnID} // Bind to searchTxnID state
            onChange={(e) => setSearchTxnID(e.target.value)} // Update searchTxnID and trigger filtering
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
            <Grid item xs={6}>
              <Button variant="contained" fullWidth onClick={toggleViewAll}>
                {viewAll ? 'Paginate' : 'View All'}
              </Button>
            </Grid>
          </Grid>
      </Grid>
    </Grid>
    <div>
      <TableContainer component={Paper} sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', p: 1 }}>
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
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">No data available.</TableCell>
              </TableRow>
            ) : (
              currentItems.map((payout, index) => (
                <TableRow key={payout._id}>
                  <TableCell>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{payout.accountHolderName || 'NA'}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{payout.trxId || 'NA'}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{Number(payout.amount || 'NA').toFixed(2)}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{payout.accountNumber || 'NA'}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{payout.ifscCode || 'NA'}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', color: payout.isSuccess === 'Success' ? 'green' : 'red'  }}>{payout.isSuccess || 'NA'}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>
                    {new Date(payout.createdAt).toLocaleString()}
                  </TableCell>
                 
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!viewAll && (
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
          />
        </Grid>
      )}
      </div>
      
    </div>
  );
};

export default Payoutgen;
