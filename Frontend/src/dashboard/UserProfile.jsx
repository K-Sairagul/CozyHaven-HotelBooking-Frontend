import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Edit3, Phone, Mail, User as GenderIcon, Hash } from 'react-feather';

const UserProfile = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!auth?.userId) {
          throw new Error('User not authenticated');
        }

        const response = await axios.get(`https://localhost:7274/api/v1/auth/users/${auth.userId}`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        });
        
        setUserData(response.data);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 403) {
            setError('You are not authorized to view this profile');
          } else if (err.response.status === 404) {
            setError('User not found');
          } else {
            setError('An error occurred while fetching user data');
          }
        } else {
          setError(err.message || 'Network error. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth]);

  const handleEditClick = () => {
    navigate('/profile/edit');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const profileFields = [
    {
      icon: <Hash size={16} className="text-blue-500" />,
      label: "User ID",
      value: userData.userId
    },
    {
      icon: <User size={16} className="text-blue-500" />,
      label: "Full Name",
      value: userData.fullName
    },
    {
      icon: <Mail size={16} className="text-blue-500" />,
      label: "Email",
      value: userData.email
    },
    {
      icon: <GenderIcon size={16} className="text-blue-500" />,
      label: "Gender",
      value: userData.gender || 'Not specified'
    },
    {
      icon: <Phone size={16} className="text-blue-500" />,
      label: "Contact Number",
      value: userData.contactNumber || 'Not provided'
    }
  ];

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {/* Profile Header */}
        <div className="bg-blue-600 px-4 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold">Profile Information</h1>
            </div>
            <button 
              onClick={handleEditClick}
              className="flex items-center px-3 py-1.5 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm"
            >
              <Edit3 size={14} className="mr-1.5" />
              Edit
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-4">
          <div className="space-y-3">
            {profileFields.map((field, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                  {field.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-gray-500">{field.label}</h3>
                  <p className="mt-0.5 text-sm font-medium text-gray-800">{field.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;