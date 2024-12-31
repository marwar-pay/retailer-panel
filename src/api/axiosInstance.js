// /src/api/axiosInstance.js
import axios from "axios";
import { HandleAxiosError } from "./axioserror";


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
  // console.log("accessToken>>>>",token);
  
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
    HandleAxiosError(err)// Call the error handler function
    return Promise.reject(err);
  }
);



export { axiosInstance };




