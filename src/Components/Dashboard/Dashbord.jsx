
import WalletDetails from './Walletdetails'
import Payinout from './Payinamout'
import Ticketdetails from './Ticketdetails'
import Blog from "../../assets/images/Blog.png"
function Dashbord() {
  return (
    <div className="backimg">
<div className='topsidebar'>
  <div className='row'>
    <div className='col-8'>
      <h1 className='sidebar-text'>ZanithPay Infotech Pvt Ltd - Your trusted partner for financial solutions.</h1>
    </div>
    <div className='col-4'>
      <img className='sidebar-image' src={Blog} alt="Blog" />
    </div>
  </div>
</div>
      <WalletDetails/>
      <Payinout/>
      <Ticketdetails/>
      
      </div>
  )
}

export default Dashbord
