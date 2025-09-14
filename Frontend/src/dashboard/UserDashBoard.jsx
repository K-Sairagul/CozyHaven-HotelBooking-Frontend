import React, { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


const UserDashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { auth, logout } = useAuth()
  const userRole = localStorage.getItem('userRole') || 'user'


  const [sidebarOpen, setSidebarOpen] = useState(false)


  const isActive = (path) => location.pathname.includes(path)


  const handleLogout = () => {
    logout()
    navigate('/login')
  }


  // Menu links
  const menuLinks = [
    {
      label: 'Profile',
      to: 'dashboard/profile',
      key: 'profile',
      svg: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    ...(userRole === 'User'
      ? [
          {
            label: 'My Bookings',
            to: '/userdashboard/dashboard/bookings',
            key: 'bookings',
            svg: (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
              </svg>
            ),
          },
          {
            label: 'Comments',
            to: '/userdashboard/dashboard/mycomment',
            key: 'mycomment',
            svg: (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            ),
          },
          {
            label: 'Payment History',
            to: '/userdashboard/dashboard/paymenthistory',
            key: 'paymenthistory',
            svg: (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ),
          },
        ]
      : []),
    ...(userRole === 'Admin'
      ? [
          {
            label: 'Add Hotel',
            to: 'dashboard/addhotel',
            key: 'addhotel',
            svg: (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            ),
          },
          {
            label: 'Add Room',
            to: 'dashboard/addroom',
            key: 'addroom',
            svg: (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            ),
          },
          {
            label: 'All Hotels',
            to: 'dashboard/allhotels',
            key: 'allhotels',
            svg: (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            ),
          },
          {
            label: 'All Rooms',
            to: 'dashboard/allrooms',
            key: 'allrooms',
            svg: (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            ),
          },
          {
            label: 'User Booking Status',
            to: 'dashboard/userbookingstatus',
            key: 'userbookingstatus',
            svg: (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            ),
          },
          {
            label: 'Full Payment History',
            to: '/userdashboard/dashboard/fullpaymenthistory',
            key: 'fullpaymenthistory',
            svg: (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            ),
          },
          {
            label: 'Hotel Comments',
            to: '/userdashboard/dashboard/usermycomment',
            key: 'usermycomment',
            svg: (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            ),
          },
        ]
      : []),
    {
      label: 'Settings',
      to: 'dashboard/settings',
      key: 'settings',
      svg: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
  <Link
  to="/hotels"
  className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl"
  style={{ textDecoration: 'none' }}
>
  SB
</Link>

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
                    <span className="ml-2 hidden md:block text-gray-700">{auth?.fullName || 'User'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>


      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar drawer */}
        <div
          className={`fixed inset-0 z-40 md:hidden bg-black bg-opacity-25 transition-opacity ${
            sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden={!sidebarOpen}
          onClick={() => setSidebarOpen(false)}
        ></div>


        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-md transform transition-transform duration-300 md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
              <p className="text-xs text-gray-500 mt-1">Welcome back, {auth?.fullName?.split(' ')[0] || 'User'}</p>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {menuLinks.map(({ label, to, key, svg }) => (
                <Link
                  key={key}
                  to={to}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${
                    isActive(key)
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                  style={{ textDecoration: 'none' }}
                  onClick={() => setSidebarOpen(false)} // Close on mobile navigation
                >
                  <div
                    className={`p-1.5 rounded-lg mr-3 ${
                      isActive(key)
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'
                    }`}
                  >
                    {svg}
                  </div>
                  <span className="truncate">{label}</span>
                  {isActive(key) && <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>}
                </Link>
              ))}
              <button
                onClick={() => {
                  handleLogout()
                  setSidebarOpen(false)
                }}
                className="group flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg mx-2 mt-auto mb-6 transition-all duration-200 hover:bg-red-50 hover:text-red-600 focus:outline-none"
              >
                <div className="p-1.5 rounded-lg mr-3 bg-gray-100 text-gray-500 group-hover:bg-red-50 group-hover:text-red-500">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        </aside>


        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-y-auto bg-gray-50">
          {/* Mobile top bar with menu button */}
          <div className="md:hidden flex items-center p-2 shadow border-b border-gray-200 bg-white">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Open sidebar"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="ml-4 text-lg font-semibold text-gray-900">Dashboard</h2>
          </div>


          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}


export default UserDashboard