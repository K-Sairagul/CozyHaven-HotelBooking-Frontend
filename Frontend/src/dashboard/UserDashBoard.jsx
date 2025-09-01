import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  // Get userRole from localStorage
  const userRole = localStorage.getItem('userRole') || 'user';

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation Bar - unchanged */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                  SB
                </div>
                <span className="ml-3 text-xl font-semibold text-gray-900 hidden md:block">
                  Stay<span className="text-blue-600">Book</span>
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="relative">
                  <button className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-medium">
                      {auth?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="ml-2 hidden md:block text-gray-700">
                      {auth?.fullName || 'User'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
              <p className="text-xs text-gray-500 mt-1">Welcome back, {auth?.fullName?.split(' ')[0] || 'User'}</p>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {/* Profile - visible to both */}
              <Link
                to="dashboard/profile"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${
                  isActive('profile')
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
                style={{ textDecoration: 'none' }}
              >
                <div className={`p-1.5 rounded-lg mr-3 ${
                  isActive('profile')
                    ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'
                }`}>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className="truncate">Profile</span>
                {isActive('profile') && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                )}
              </Link>

              {userRole === 'User' && (
  <>
    {/* My Bookings Link */}
    <Link
      to="/userdashboard/dashboard/bookings"
      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${
        isActive('mybookings')
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100'
          : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
      }`}
      style={{ textDecoration: 'none' }}
    >
      <div
        className={`p-1.5 rounded-lg mr-3 ${
          isActive('mybookings')
            ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600'
            : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'
        }`}
      >
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7h18M3 12h18M3 17h18"
          />
        </svg>
      </div>
      <span className="truncate">My Bookings</span>
      {isActive('mybookings') && (
        <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
      )}
    </Link>

    <Link
                to="/userdashboard/dashboard/mycomment"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${
                  isActive('mycomment')
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
                style={{ textDecoration: 'none' }}
              >
                <div className={`p-1.5 rounded-lg mr-3 ${
                  isActive('mycomment')
                    ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'
                }`}>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <span className="truncate">Comments</span>
                {isActive('mycomment') && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                )}
              </Link>


    {/* Payment History Link */}
    <Link
      to="/userdashboard/dashboard/paymenthistory"
      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${
        isActive('fullpaymenthistory')
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100'
          : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
      }`}
      style={{ textDecoration: 'none' }}
    >
      <div
        className={`p-1.5 rounded-lg mr-3 ${
          isActive('fullpaymenthistory')
            ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600'
            : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'
        }`}
      >
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <span className="truncate">Payment History</span>
      {isActive('fullpaymenthistory') && (
        <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
      )}
    </Link>
  </>
)}


              {/* Admin specific links */}
              {userRole === 'Admin' && (
                <>
                  <Link
                    to="dashboard/addhotel"
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${
                      isActive('addhotel')
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className={`p-1.5 rounded-lg mr-3 ${
                      isActive('addhotel')
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'
                    }`}>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <span className="truncate">Add Hotel</span>
                    {isActive('addhotel') && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                  </Link>

                  <Link
                    to="dashboard/addroom"
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${
                      isActive('addroom')
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className={`p-1.5 rounded-lg mr-3 ${
                      isActive('addroom')
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'
                    }`}>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <span className="truncate">Add Room</span>
                    {isActive('addroom') && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                  </Link>


                  <Link
                    to="dashboard/allhotels"
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${
                      isActive('allhotels')
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className={`p-1.5 rounded-lg mr-3 ${
                      isActive('allhotels')
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'
                    }`}>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <span className="truncate">All Hotels</span>
                    {isActive('allhotels') && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                  </Link>



                    <Link
                    to="dashboard/allrooms"
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${
                      isActive('allrooms')
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className={`p-1.5 rounded-lg mr-3 ${
                      isActive('allrooms')
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'
                    }`}>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <span className="truncate">All Rooms</span>
                    {isActive('allrooms') && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                  </Link>




                  <Link
                    to="dashboard/userbookingstatus"
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${
                      isActive('userbookingstatus')
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className={`p-1.5 rounded-lg mr-3 ${
                      isActive('userbookingstatus')
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'
                    }`}>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <span className="truncate">User Booking Status</span>
                    {isActive('userbookingstatus') && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                  </Link>


                   <Link
                    to="/userdashboard/dashboard/fullpaymenthistory"
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${
                      isActive('fullpaymenthistory')
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className={`p-1.5 rounded-lg mr-3 ${
                      isActive('fullpaymenthistory')
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'
                    }`}>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <span className="truncate">Payment History</span>
                    {isActive('fullpaymenthistory') && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                  </Link>


                  <Link
                to="/userdashboard/dashboard/usermycomment"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${
                  isActive('usermycomment')
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
                style={{ textDecoration: 'none' }}
              >
                <div className={`p-1.5 rounded-lg mr-3 ${
                  isActive('usermycomment')
                    ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'
                }`}>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <span className="truncate">Hotel Comments</span>
                {isActive('usermycomment') && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                )}
              </Link>

                 
                </>
              )}

              {/* User specific links - unchanged */}
              


              
              {/* Settings - visible to both */}
              <Link
                to="dashboard/settings"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${
                  isActive('settings')
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
                style={{ textDecoration: 'none' }}
              >
                <div className={`p-1.5 rounded-lg mr-3 ${
                  isActive('settings')
                    ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'
                }`}>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="truncate">Settings</span>
                {isActive('settings') && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                )}
              </Link>

              <div className="border-t border-gray-200 my-3 mx-4"></div>

              <button
                onClick={handleLogout}
                className="group flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg mx-2 transition-all duration-200 hover:bg-red-50 hover:text-red-600 focus:outline-none"
              >
                <div className="p-1.5 rounded-lg mr-3 bg-gray-100 text-gray-500 group-hover:bg-red-50 group-hover:text-red-500">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <span className="truncate">Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Mobile sidebar button (hidden on desktop) */}
        <div className="md:hidden fixed bottom-6 right-6 z-20">
          <button className="p-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {isActive('profile') && 'My Profile'}
                    {isActive('bookings') && 'My Bookings'}
                    {isActive('paymenthistory') && 'Payment History'}
                    {isActive('mycomment') && 'My Comments'}
                    {isActive('settings') && 'Account Settings'}
                    {isActive('addhotel') && 'Add Hotel'}
                    {isActive('addroom') && 'Add Room'}
                    {isActive('userbookedhotel') && 'User Booked Hotels'}
                    {isActive('userbookedroom') && 'User Booked Rooms'}
                  </h1>
                  <p className="text-gray-500 mt-1">
                    {isActive('profile') && 'Manage your personal information'}
                    {isActive('bookings') && 'View and manage your bookings'}
                    {isActive('paymenthistory') && 'Track your payment history'}
                    {isActive('mycomment') && 'View and edit your comments'}
                    {isActive('settings') && 'Update your account settings'}
                    {isActive('addhotel') && 'Add new hotel to the system'}
                    {isActive('addroom') && 'Add new room to the system'}
                    {isActive('userbookedhotel') && 'View all user booked hotels'}
                    {isActive('userbookedroom') && 'View all user booked rooms'}
                  </p>
                </div>
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;