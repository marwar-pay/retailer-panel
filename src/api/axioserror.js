

export const HandleAxiosError = (err) => { 
  
    if (!err) {
      return;
    }
  
    // Handling token errors (e.g., invalid or expired token)
    if (err.response?.status === 401 || err.response?.status === 403) {
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
      window.location.href = "/login";
    }
  
    // You can also add handling for other error statuses, e.g., 500 for server errors
    if (err.response?.status === 500) {
      console.error("Server error occurred");
    }
  };