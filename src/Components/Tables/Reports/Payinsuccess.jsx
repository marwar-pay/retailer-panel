import { useState, useEffect, useRef } from 'react';
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
  Grid,
  Button,
  Pagination,
  useMediaQuery
} from '@mui/material';


import { apiGet } from '../../../api/apiMethods';

const Payinsuc = () => {
  const [qrData, setQrData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalDocs, setTotalDocs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [noData, setNoData] = useState(false); // Flag to track empty results
  const isSmallScreen = useMediaQuery("(max-width:800px)");
  const isFirstRender = useRef(true);
  const API_ENDPOINT = "apiUser/v1/payin/getAllPayInSuccess";
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (exportCSV = "false") => {
    try {
      // Prevent API call if only one date is entered
   
      if (exportCSV === "true" && (!searchStartDate || !searchEndDate)) {

        alert("choose a date")
        return;
      }
      const start = new Date(searchStartDate);
      const end = new Date(searchEndDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  
      // Restrict export to 15 days only
      if (exportCSV === "true" && diffDays >= 10) {
        alert("You can only export data for a maximum of 10 days.");
        return;
      }
      if ((searchStartDate && !searchEndDate) || (!searchStartDate && searchEndDate)) return;

      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        keyword: searchInput,
        startDate: searchStartDate || "",
        endDate: searchEndDate || "",
        export: exportCSV,
      });

      const response = await apiGet(`${API_ENDPOINT}?${queryParams}`);

      if (exportCSV === "true") {
        const blob = new Blob([response.data], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `payin-success${searchStartDate}-${searchEndDate}.csv`;
        link.click();
        link.remove();
        return;
      }

      if (Array.isArray(response.data.data) && response.data.data.length > 0) {
        setQrData(response.data.data);
        setTotalDocs(response.data.totalDocs);
        setTotalPages(Math.ceil(response.data.totalDocs / itemsPerPage));
        setNoData(false); // Data is available
        setIsLoading(false);
      } else {
        setQrData([]);
        setTotalDocs(0);
        setTotalPages(1);
        setNoData(true); // No data found
        setIsLoading(false);
      }
    } catch (error) {
      console.error("There was an error fetching the QR data!", error);
    }
  };


 
  useEffect(() => {
    fetchData();
    const totalPages = Math.ceil(totalDocs / itemsPerPage);
    setTotalPages(totalPages);
  }, [currentPage, itemsPerPage, searchStartDate, searchEndDate]);
  

  // Debounced search to reduce API calls
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

  // Handle Reset
  const handleReset = () => {
    setSearchInput("");
    setSearchStartDate("");
    setSearchEndDate("");
    setCurrentPage(1);
    setNoData(false);
  };

  // Handle Pagination Change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <>
      <Grid
        sx={{
          mb: 3,
          position: isSmallScreen ? 'relative' : 'sticky', // Remove sticky for small screens
          top: isSmallScreen ? 'auto' : 0,
          zIndex: 1000,
          backgroundColor: 'white',
        }} className='setdesigntofix'
      >
        <Grid container alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs>
            <Typography variant="h5" gutterBottom>
              Payin Success Information
            </Typography>
          </Grid>
          <Button variant="contained" onClick={() => fetchData("true")}>
            Export
          </Button>
        </Grid>

        <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Search by TxnID"
              variant="outlined"
              fullWidth
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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
              onChange={(e) => setSearchStartDate(e.target.value)}
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
              onChange={(e) => setSearchEndDate(e.target.value)}
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
              <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Charge Amount</strong></TableCell>
              <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>Final Amount</strong></TableCell>
              <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>VPA ID</strong></TableCell>
              <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}><strong>RRN</strong></TableCell>
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
  ) : noData ? (
    <TableRow>
      <TableCell colSpan={6} align="center">
        No data available.
      </TableCell>
    </TableRow>
  ) : (
              qrData.map((qr, index) => (
                <TableRow key={qr._id}>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{qr.payerName || "NA"}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{qr.trxId || "NA"}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{Number(qr.amount || "NA").toFixed(2)}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{Number(qr.chargeAmount || "NA").toFixed(2)}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{Number(qr.finalAmount || "NA").toFixed(2)}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{qr.vpaId || "NA"}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{qr.bankRRN || "NA"}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }} style={{ color: qr.isSuccess === "Success" ? "green" : "red" }}>
                    {qr.isSuccess || "NA"}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{new Date(qr.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container justifyContent="center" sx={{ mt: 2 }}>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} variant="outlined" shape="rounded" />
      </Grid>
    </>
  );
};

export default Payinsuc;
