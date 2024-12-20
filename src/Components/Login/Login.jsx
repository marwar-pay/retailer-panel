import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Link,
  Paper,
  IconButton,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { domainBase } from "../../helpingFile";
import assetimg from "../../assets/images/Login.gif";
import logo from "../../assets/images/logologin.png";
import bg from "../../assets/images/bgimgmarwar.jpg";
import { apiPost } from "../../api/apiMethods";

const API_ENDPOINT = `apiUser/v1/userRoute/login`;

const Login = () => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      const response = await apiPost(API_ENDPOINT, {
        userName,
        password,
      });
  
      const { accessToken, refreshToken, user } = response.data.data;
   
      if (user.memberType === "Retailer") {
        if (accessToken && refreshToken) { 
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken); 
          const expirationTime = new Date().getTime() + (rememberMe ? 24 : 1) * 60 * 60 * 1000;
          localStorage.setItem("expirationTime", expirationTime);
  
          setSnackbarMessage("Login successful!");
          setOpenSnackbar(true);
   
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          throw new Error("Access token or refresh token is missing.");
        }
      } else {
        // Show error for non-Retailer users
        setSnackbarMessage("Login failed. Only Retailer accounts can log in.");
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      setSnackbarMessage("Login failed. Please try again.");
      setOpenSnackbar(true);
    }
  };
  

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <div style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      height: "100vh", // Ensure the background covers the entire viewport height
    }}>
      <Box sx={{
        padding: "92px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Container sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}>
            {/* Left side image */}
            <Box sx={{
              flex: 1,
              display: { xs: "none", sm: "flex" },
              justifyContent: "center",
              alignItems: "center",
            }}>
              <img src={assetimg} alt="Login" style={{
                width: "100%",
                height: "auto",
              }} />
            </Box>

            {/* Right side form */}
            <Box sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: { xs: 2, sm: 0 },
            }}>
              <Paper elevation={3} sx={{
                padding: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 2,
                width: "100%",
                maxWidth: "400px",
              }}>
                <Box sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  position: "relative",
                }}>
                  <img src={logo} alt="Logo" style={{
                    position: 'absolute',
                    bottom: '-1px',
                  }} />
                </Box>
                <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 700, marginTop: "20px" }}>
                  Log In
                </Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="userName"
                    label="User Name"
                    name="userName"
                    autoComplete="userName"
                    autoFocus
                    value={userName}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                    }
                    label="Remember me"
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        color: "#1976d2",
                        "&:hover": {
                          color: "black",
                        },
                      },
                    }}
                  />
                  <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="#" variant="body2" sx={{
                        color: "#1976d2",
                        textDecoration: "none",
                        "&:hover": { color: "black" },
                      }}>
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="#" variant="body2" sx={{
                        color: "#1976d2",
                        textDecoration: "none",
                        "&:hover": { color: "black" },
                      }}>
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes("failed") ? "error" : "success"} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>

      {/* Social media icons */}
      <Box sx={{
        marginTop: '-80px',
        display: "flex",
        justifyContent: "center",
        gap: 2,
        paddingBottom: '18px',
      }}>
        <IconButton href="https://www.facebook.com/Marwarpay/" target="_blank" sx={{ color: "black", fontSize: 50 }}>
          <FacebookIcon sx={{ fontSize: "inherit" }} />
        </IconButton>
        <IconButton href="https://www.instagram.com/marwarpayofficial/" target="_blank" sx={{ color: "black", fontSize: 50 }}>
          <InstagramIcon sx={{ fontSize: "inherit" }} />
        </IconButton>
        <IconButton href="https://www.twitter.com" target="_blank" sx={{ color: "black", fontSize: 50 }}>
          <TwitterIcon sx={{ fontSize: "inherit" }} />
        </IconButton>
      </Box>
    </div>
  );
};

export default Login;
