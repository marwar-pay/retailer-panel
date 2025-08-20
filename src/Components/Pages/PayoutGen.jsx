

import { useEffect, useState } from "react";

import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Stack,
} from "@mui/material";
import { apiGet, apiPost } from "../../api/apiMethods";


const generateRandomId = () => {
  const length = Math.floor(Math.random() * (20 - 13 + 1)) + 13;
  let randomString = "";
  while (randomString.length < length) {
    randomString += Math.random().toString(36).slice(2);
  }
  return randomString.slice(0, length);
};

const PayoutGenerator = () => {
  const API_ENDPOINT = "apiUser/v1/userRoute/userInfo";

  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    userName: "",
    mobileNumber: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    trxId: generateRandomId(),
    amount: "",
    bankName: "",
    authToken: "",
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiPost("apiAdmin/v1/payout/generatePayOut", {
        ...formData,
      });
      setResponse(res.data);
      setError(null);
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.response?.data || "An error occurred");
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNewTransaction = () => {
    setResponse(null);
    setError(null);
    setFormData((prev) => ({
      ...prev,
      mobileNumber: "",
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      amount: "",
      bankName: "",
      trxId: generateRandomId(),
    }));
  };

  useEffect(() => {
    apiGet(API_ENDPOINT)
      .then((response) => {
        setUserData(response.data.data);
        setFormData((prev) => ({
          ...prev,
          userName: response.data.data.userName,
          authToken: response.data.data.trxAuthToken,
        }));
      })
      .catch((error) => {
        console.error("Error fetching user data!", error);
      });
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Payout Generator
      </Typography>
      <Typography variant="h6" align="center" color="primary">
        Welcome, {formData.userName || "User"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Account Holder Name"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Account Number"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="IFSC Code"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Transaction ID"
              name="trxId"
              value={formData.trxId}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Bank Name"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          Generate Payout
        </Button>
      </form>

      {loading && (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      )}

      {response && (
        <>
          <Alert severity="success" sx={{ mt: 3 }}>
            <Typography variant="h6">Response:</Typography>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </Alert>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => window.history.back()}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNewTransaction}
            >
              New Transaction
            </Button>
          </Stack>
        </>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          <Typography variant="h6">Error:</Typography>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </Alert>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="Payout successfully generated"
      />
    </Container>
  );
};

export default PayoutGenerator;
