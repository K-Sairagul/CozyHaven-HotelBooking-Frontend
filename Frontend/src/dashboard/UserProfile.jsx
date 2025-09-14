import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { User, Edit3, Phone, Mail, User as GenderIcon, Hash } from 'react-feather'

const UserProfile = () => {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!auth?.userId) {
          throw new Error('User not authenticated')
        }

        const response = await axios.get(
          `https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/v1/auth/users/${auth.userId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        )
        setUserData(response.data)
      } catch (err) {
        if (err.response) {
          if (err.response.status === 403) {
            setError('You are not authorized to view this profile')
          } else if (err.response.status === 404) {
            setError('User not found')
          } else {
            setError('An error occurred while fetching user data')
          }
        } else {
          setError(err.message || 'Network error. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [auth])

  const handleEditClick = () => {
    navigate('/profile/edit')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
          <div className="flex items-center space-x-3">
            <svg
              className="h-6 w-6 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.707-10.707a1 1 0 011.414 0L12 8.586l1.293-1.293a1 1 0 111.414 1.414L13.414 10l1.293 1.293a1 1 0 01-1.414 1.414L12 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L10.586 10 9.293 8.707z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const profileFields = [
    {
      icon: <Hash size={18} className="text-blue-600" />,
      label: 'User ID',
      value: userData.userId,
    },
    {
      icon: <User size={18} className="text-blue-600" />,
      label: 'Full Name',
      value: userData.fullName,
    },
    {
      icon: <Mail size={18} className="text-blue-600" />,
      label: 'Email',
      value: userData.email,
    },
    {
      icon: <GenderIcon size={18} className="text-blue-600" />,
      label: 'Gender',
      value: userData.gender || 'Not specified',
    },
    {
      icon: <Phone size={18} className="text-blue-600" />,
      label: 'Contact Number',
      value: userData.contactNumber || 'Not provided',
    },
  ]

  return (
    <main className="max-w-lg mx-auto p-4 sm:p-6 md:p-8">
      <section className="bg-white rounded-lg shadow-md border border-gray-200">
        {/* Header */}
        <header className="bg-blue-600 rounded-t-lg px-6 py-4 flex justify-between items-center">
          <h1 className="text-white text-xl font-semibold">Profile Information</h1>
          <button
            onClick={handleEditClick}
            className="flex items-center bg-white text-blue-600 hover:bg-blue-50 rounded-md px-3 py-1.5 text-sm font-medium transition"
            aria-label="Edit Profile"
          >
            <Edit3 size={16} className="mr-1.5" />
            Edit
          </button>
        </header>

        {/* Content */}
        <div className="px-6 py-6 space-y-5">
          {profileFields.map(({ icon, label, value }, idx) => (
            <div key={idx} className="flex items-center space-x-4">
              <div className="flex-shrink-0 rounded-full bg-blue-50 p-2 flex items-center justify-center w-10 h-10">
                {icon}
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500">{label}</dt>
                <dd className="mt-0.5 text-base font-medium text-gray-900">{value}</dd>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default UserProfile
