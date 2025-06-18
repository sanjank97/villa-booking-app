import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Home from './pages/Home'
import AdminDashborad from './pages/admin/Dashboard'
import Register from './pages/Register'
import Villa from './pages/Villa'
import DashboardHome from './components/DashboradHome'
import {VillaList} from './components/VillaList'
import {AddVilla}  from './components/AddVilla'
import {EditVilla}  from './components/EditVilla'
import {UserList}  from './components/UserList'
import {BookingList}  from './components/BookingList'

import Navbar from './components/Navbar'
import Myaccount from './pages/Myaccount'
import BookingForm from './pages/BookingForm'
import ThankYou from './pages/ThankYou'
import Wishlist from './pages/Wishlist'


export default function App() {
  return (
    <>
     <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/villas" element={<Villa />} /> 
        <Route path="/myaccount" element={<Myaccount />} /> 
        <Route path="/booking-form" element={<BookingForm />} />
        <Route path="/thank-you/:bookingId" element={<ThankYou />} />
         <Route path="/wishlist" element={<Wishlist />} />
        
        <Route path="/admin/dashboard" element={<AdminDashborad />}>
          <Route index element={<DashboardHome />} />
          <Route path="villas" element={<VillaList />} />
          <Route path="add-villa" element={<AddVilla />} />
          <Route path="edit-villa/:id" element={<EditVilla />} />
          <Route path="users" element={<UserList />} />
          <Route path="bookings" element={<BookingList />} />
        </Route>
      </Routes>
    
    </>
  )
}

