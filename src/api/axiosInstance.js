// /src/api/axiosInstance.js
import axios from "axios";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: "https://api.zanithpay.com/",
  // baseURL: "http://192.168.1.4:5000/",
  headers: {
    "Content-Type": "application/json",
     },
});

// Request Interceptor
axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("accessToken");
  console.log("accessToken>>>>",token);
  
  if (token) {
    // config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY3ZjQ4NTA3NDUyYmM2NmU2MDMzYTciLCJ1c2VyTmFtZSI6InRlc3QiLCJtZW1iZXJJZCI6Ik0xNzI3NTI2MDIxNTc5IiwibWVtYmVyVHlwZSI6IlVzZXJzIiwiaWF0IjoxNzM0NjA1ODkxLCJleHAiOjE3MzQ2OTIyOTF9.aYf2IvUqImQvGfhqkzWRQ-wQ3VrN5oplKNLVDYd0-lM`;
    config.headers["authorization"] = `Bearer ${String(token)}`;
  }
  return config;
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (res) => {
    // Store the refresh token in localStorage when a successful response is received
    if (res.data?.data?.accessToken) {
      localStorage.setItem("accessToken", res.data.data.accessToken);
    }
    return res;
  },
  (err) => {
    // Optionally handle errors
    // return Promise.reject(err);
    HandleAxiosError(err); // Call the error handler function
    return Promise.reject(err);
  }
);



export { axiosInstance };


export const HandleAxiosError = (err) => {
  const navigate= useNavigate();

  if (!err) {
    return;
  }

  // Handling token errors (e.g., invalid or expired token)
  if (err.response?.status === 401) {
    // Remove invalid or expired token
    if (
      localStorage.getItem("accessToken") !== "undefined" &&
      localStorage.getItem("accessToken") !== null
    ) {
      localStorage.removeItem("accessToken");
    }

    // Optionally remove the refreshToken as well, if needed
    localStorage.removeItem("refreshToken");

    // Redirect to login page
    navigate("/login");
  }

  // You can also add handling for other error statuses, e.g., 500 for server errors
  if (err.response?.status === 500) {
    console.error("Server error occurred");
  }
};

