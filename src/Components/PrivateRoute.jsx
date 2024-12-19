import { Navigate, Outlet } from "react-router-dom";
import { accessConstent } from "../helpingFile";

const PrivateRoute = () => {
  const accessToken = localStorage.getItem(accessConstent);

  // Check if the user is authenticated
  return accessToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
