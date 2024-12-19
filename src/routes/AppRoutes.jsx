// AppRoutes.js

import { Routes, Route } from 'react-router-dom';
import Dashboard from '../Components/Dashboard/Dashbord';
import Mywallet from '../Components/Tables/Ewalletmanagment/Mywallet';

import PayoutSuccess from '../Components/Tables/Reports/Payoutsuc';

import Payoutgen from '../Components/Tables/Reports/Payoutgen';


import ViewTicket from '../Components/Tables/Support/Viewticket';
import CreateTicket from '../Components/Pages/Support/Createsupportticket';


import ChangePassword from '../Components/Pages/Setting/Changepass';
import Profile from '../Components/Pages/Setting/Profile';
import EditProfile from '../Components/Pages/Setting/EditProfile';

import useAxiosInterceptors from '../axiosConfig';
import PayoutGenerator from '../Components/Pages/PayoutGen';



const AppRoutes = () => {
  useAxiosInterceptors(); 
  return (
    <Routes> 
      <Route path="/" element={<Dashboard />} />
      <Route path="/my-wallet" element={<Mywallet />} />

      <Route path="/payout" element={<PayoutSuccess />} />
    
      <Route path="/payoutgen" element={<Payoutgen />} />
      <Route path="/createpayout" element={<PayoutGenerator />} />
     
   

      <Route path="/view-tickets" element={<ViewTicket />} />
      <Route path="/create-ticket" element={<CreateTicket />} />
 
      <Route path="/settings/profile" element={<Profile />} />
      <Route path="/settings/changepassword" element={<ChangePassword />} />
      <Route path="/settings/edit" element={<EditProfile />} />
     
   </Routes>
  );
};

export default AppRoutes;
