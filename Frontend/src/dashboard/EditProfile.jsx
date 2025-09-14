import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gender: '',
    contactNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!auth?.userId) {
          throw new Error('User not authenticated');
        }

        const response = await axios.get(`https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/v1/auth/users/${auth.userId}`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        });

        setFormData(prev => ({
          ...prev,
          fullName: response.data.fullName,
          email: response.data.email,
          gender: response.data.gender || '',
          contactNumber: response.data.contactNumber || ''
        }));
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Validate password fields if any password is entered
      if (formData.newPassword || formData.confirmPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('New passwords do not match');
        }
        if (!formData.currentPassword) {
          throw new Error('Current password is required to change password');
        }
      }

      // Prepare the update payload
      const updatePayload = {
        fullName: formData.fullName,
        email: formData.email,
        gender: formData.gender,
        contactNumber: formData.contactNumber,
        ...(formData.newPassword && { newPassword: formData.newPassword })
      };

      await axios.put(
        `https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/v1/auth/users/${auth.userId}`,
        updatePayload,
        {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/userdashboard/dashboard/profile'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Section with Back Button on top right */}
          <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Edit Profile</h1>
              <p className="text-blue-100 mt-1">Update your personal information</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/userdashboard/dashboard/profile')}
              className="px-4 py-2 border border-white rounded-lg shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition"
            >
              Back to Profile
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
                <div className="flex items-start">
                  <svg className="h-5 w-5 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>{error}</div>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md shadow-sm">
                <div className="flex items-start">
                  <svg className="h-5 w-5 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>{success}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Personal Information</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="e.g. +1 234 567 8900"
                    />
                  </div>
                </div>
              </div>

              {/* Password Change Section */}
              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
                <p className="text-sm text-gray-500 mb-4">Leave password fields blank if you don't want to change your password.</p>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Enter your current password"
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end space-y-4 space-y-reverse sm:space-y-0 sm:space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/userdashboard')}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
