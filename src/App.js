import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes,Route } from 'react-router-dom';
import "./App.css";
import {useFirebase} from './context/Firebase';
import { getToken } from 'firebase/messaging';
import RegisterPage from "./pages/Register";
import LoginPage from './pages/Login';
import MyNavbar from './components/Navbar';
import ListingPage from './pages/List';
import BookDetail from './pages/Detail';
import OrdersPage from './pages/ViewOrder';
import ViewOrderDetails from './pages/ViewOrderDetail';
import { useEffect } from 'react';

import HomePage from './pages/Home';

function App() {
  const firebase=useFirebase();
  async function requestPermission(){
     const permission=await Notification.requestPermission()
     if(permission==='granted'){
      const token=await getToken(firebase.messaging,{
    vapidKey:'BOz6Fse0HFIRJucZuUVhUIvXcPsrEbHAzJPjz0Ou5WqLgiN0WPGRdmJZ-w3uz72MmrYQNfnlks2tpYHFWb4qaeA'});
     }else if(permission==='denied'){
       alert('You denied for the notification');
     }
  }
  return (
  <div>
  <MyNavbar/>
  <Routes>
    <Route path='/' element={<HomePage/>}/>
    <Route path='/login' element={<LoginPage/>}/>
    <Route path="/register" element={<RegisterPage/>}/>
    <Route path='/book/list' element={<ListingPage/>}/>
    <Route path='/book/view/:bookId' element={<BookDetail/>}/>
    <Route path='/book/orders' element={<OrdersPage/>}/>
    <Route path='/books/orders/:bookId' element={<ViewOrderDetails/>}/>
  </Routes>
  </div>
  )
}
export default App;
