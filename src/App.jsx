

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Login/Login';
import PrivateRoute from './Components/PrivateRoute';
import Sidebar from './Components/Sidebar/SIdebar';



function AppRoutes() {
  
  return (
  
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Private routes */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/*"
              element={
                <>
                  <Sidebar />
                </>
              }
            />
          </Route>

          {/* Redirect all unknown routes to login */}
          <Route path="*" element={<Navigate to="/dashbord" />} />
        </Routes>
      </Router>
   
  );
}

export default AppRoutes;
