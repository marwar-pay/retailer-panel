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
  Grid,
  Button,
  Pagination
} from '@mui/material';
import axios from 'axios';
import { accessConstent, domainBase } from '../../../helpingFile';
import { saveAs } from 'file-saver';

const Payinsuc = () => {
  const [qrData, setQrData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewAll, setViewAll] = useState(false); // Add state for "View All" functionality
  const itemsPerPage = 10;
  const API_ENDPOINT = `${domainBase}apiUser/v1/payin/getAllPayInSuccess`;
  const token = localStorage.getItem(accessConstent);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(response.data.data)) {
          setQrData(response.data.data);
          setFilteredData(response.data.data);
        } else {
          console.error('Data is not an array:', response.data.data);
        }
      } catch (error) {
        console.error('There was an error fetching the QR data!', error);
      }
    };

    fetchData();
  }, []);

  const handleFilter = () => {
    let filtered = qrData.filter((item) => {
      const matchesName = item.name?.toLowerCase().includes(searchInput.toLowerCase());
      const matchesTxnID = item.trxId?.toLowerCase().includes(searchInput.toLowerCase());

      const trxDate = new Date(item.createdAt);
      trxDate.setHours(0, 0, 0, 0);

      const startDate = searchStartDate ? new Date(searchStartDate) : null;
      const endDate = searchEndDate ? new Date(searchEndDate) : null;

      if (startDate) startDate.setHours(0, 0, 0, 0);
      if (endDate) endDate.setHours(23, 59, 59, 999);

      const isStartDateOnly = startDate && !endDate && trxDate.getTime() === startDate.getTime();
      const isWithinDateRange =
        startDate && endDate && trxDate >= startDate && trxDate <= endDate;

      return (
        (matchesName || matchesTxnID) &&
        (!startDate && !endDate || isStartDateOnly || isWithinDateRange)
      );
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    handleFilter();
  }, [searchInput, searchStartDate, searchEndDate]);

  const handleReset = () => {
    setSearchInput('');
    setSearchStartDate('');
    setSearchEndDate('');
    setFilteredData(qrData);
    setCurrentPage(1);
    setViewAll(false); // Reset "View All" mode
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
      ['#', 'Name','TxnID','Amount', 'Charge Amount', 'Final Amount', 'VPA ID','RRN','Status','Date'], // Header row
      ...filteredData.map((item, index) => [
        index + 1,
        item.payerName || 'NA',
        item.trxId || 'NA',
        item.amount || 'NA',
        item.chargeAmount || 'NA',
        item.finalAmount || 'NA',
        item.vpaId || 'NA',
        item.bankRRN || 'NA',
        item.isSuccess || 'NA',
        dateFormatter.format(new Date(item.createdAt)),
      ]),
    ];
  
    const csvContent = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Payin_SuccessData.csv');
  };

  return (
    <>
      <Grid
        sx={{
          mb: 3,
          position: 'sticky',
          paddingTop: '20px',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'white',
        }}
      >
        <Grid container alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs>
            <Typography variant="h5" gutterBottom>
              Payin Success Information
            </Typography>
          </Grid>
          <Button variant="contained" onClick={handleExportData}>
            Export 
          </Button>
        </Grid>

        <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Search by Name or TxnID"
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
            <Grid item xs={6}>
              <Button variant="contained" fullWidth onClick={toggleViewAll}>
                {viewAll ? 'Paginate' : 'View All'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', p: 1 }}>
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
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center">No data available.</TableCell>
              </TableRow>
            ) : (
              currentItems.map((qr, index) => (
                <TableRow key={qr._id}>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{qr.payerName || 'NA'}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{qr.trxId || 'NA'}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', align: 'center' }}>{Number(qr.amount || 'NA').toFixed(2)}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', align: 'center' }}>{Number(qr.chargeAmount || 'NA').toFixed(2)}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', align: 'center' }}>{Number(qr.finalAmount || 'NA').toFixed(2)}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{qr.vpaId || 'NA'}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{qr.bankRRN || 'NA'}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px', color: qr.isSuccess === 'Success' ? 'green' : 'red' }}>{qr.isSuccess || 'NA'}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', whiteSpace: 'nowrap', padding: '8px' }}>{new Date(qr.createdAt).toLocaleString()}</TableCell>
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
    </>
  );
};

export default Payinsuc;
