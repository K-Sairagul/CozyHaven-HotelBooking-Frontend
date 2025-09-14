import { Routes, Route, useNavigate,useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from "./components/Login";
import Register from "./components/Register";
import HotelList from './pages/HotelList';
import ManageRoom from './pages/ManageRoom';
import RoomList from './pages/RoomList';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import BookingConfirmation from './pages/BookingConfirmation';
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ProtectedRoute from './components/ProtectedRoute';
import UserDashboard from './dashboard/UserDashBoard';
import UserBookingsPage from './dashboard/UserBookingPage';
import UserProfile from './dashboard/UserProfile';
import UserPayments from './dashboard/UserPayment';
import LandingPage from './pages/LandingPage';
import UserReviews from './pages/UserReviews';
import ChangePassword from './components/ChangePassword';
import UserReviewsPage from './dashboard/UserReviewsPage';
import EditProfile from './dashboard/EditProfile';
import AddHotelForm from './admin/AddHotelForm';
import GetAllHotels from './admin/GetAllHotels';
import AddRoomForm from './admin/AddRoomForm'
import GetAllRooms from './admin/GetAllRooms';
import BookingList from './admin/BookingList';
import AllPaymentHistoryPage from './admin/AllPaymentHistoryPage';
import AdminReviews from './admin/AdminReviews';
import UpdateHotelForm from './admin/UpdateHotelForm';
import EditRoom from './admin/EditRoom';
import DeleteRoomButton from './admin/DeleteRoomButton';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';

function RootRedirect() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  
 if (location.pathname === "/") {
    if (auth?.token) {
      return <Navigate to="/landing-page" replace />;
    } else {
      return <Navigate to="/landing-page" replace />;
    }
  }
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Base Routes */}
        
        <Route path="/" element={<LandingPage />} />


        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/hotel/:hotelId/reviews" element={<UserReviews />} />
        <Route path="/hotels/update/:id" element={<UpdateHotelForm />} />
        


        

         
        {/* Dashboard Routes */}
        <Route path="/userdashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}>
          <Route path="dashboard/profile" element={<UserProfile />} />
          <Route path="dashboard/bookings" element={<UserBookingsPage />} />
          <Route path="dashboard/paymenthistory" element={<UserPayments />} />
          <Route path="dashboard/mycomment" element={<UserReviewsPage />} />
          <Route path="dashboard/settings" element={<ChangePassword />} />

          
          <Route path="dashboard/addhotel" element={<AddHotelForm />} />
          
          <Route path="dashboard/addroom" element={<AddRoomForm />} />
          <Route path="dashboard/allhotels" element={<GetAllHotels />} />
          <Route path="dashboard/allrooms" element={<GetAllRooms />} />
          <Route path="dashboard/userbookingstatus" element={<BookingList />} />
          <Route path="dashboard/fullpaymenthistory" element={<AllPaymentHistoryPage />} />
          <Route path="dashboard/usermycomment" element={<AdminReviews />} />


          



          




          
          

        </Route>

       
<Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />


<Route 
  path="/room/update/:id" 
  element={
    <ProtectedRoute allowedRoles={['Admin', 'HotelOwner']}>
      <EditRoom />
    </ProtectedRoute>
  } 
/>





        
        {/* Hotel and Room Routes */}
        <Route 
          path="/hotels" 
          element={
            <ProtectedRoute>
              <HotelList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/hotel/:hotelId/rooms" 
          element={
            <ProtectedRoute>
              <RoomList />
            </ProtectedRoute>
          } 
        />
        
        {/* Booking Flow Routes */}
        <Route 
          path="/booking/:roomId" 
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payment/:bookingId" 
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/booking-confirmation/:bookingId" 
          element={
            <ProtectedRoute>
              <BookingConfirmation />
            </ProtectedRoute>
          } 
        />

        
        
     
        
        {/* Management Routes */}
        <Route 
          path="/manage-room/:roomId" 
          element={
            <ProtectedRoute allowedRoles={['Admin', 'HotelOwner']}>
              <ManageRoom />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Not Found Route - should be last */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;