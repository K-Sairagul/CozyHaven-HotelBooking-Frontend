import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    contactNumber: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setApiError('');
  if (!validate()) return;
  setIsSubmitting(true);
  
  try {
    // Use PascalCase property names to match your backend DTO
    const registrationData = {
      FullName: formData.fullName,
      Email: formData.email,
      Password: formData.password,
      Gender: formData.gender,
      ContactNumber: formData.contactNumber,
      Role: formData.role
    };

    console.log("Sending registration data:", registrationData);

    const response = await fetch('https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });

    console.log("Response status:", response.status);
    
    const responseText = await response.text();
    console.log("Raw response:", responseText);

    if (!response.ok) {
      let errorMessage = 'Registration failed. Please try again.';
      
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
        console.error("Error details:", errorData);
      } catch {
        errorMessage = responseText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    // Handle successful response
    if (responseText === 'User registered successfully!' || 
        responseText.includes('success')) {
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setApiError(responseText || 'Registration completed but with unexpected response.');
    }
  } catch (error) {
    console.error("Registration error:", error);
    setApiError(error.message || 'Network error. Please check your connection and try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Account</h1>
          <p className="text-white/70">Join our community and get started today</p>
        </div>

        {/* Error Alert */}
        {apiError && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500 text-red-400 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Full Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full bg-transparent text-white border ${
                    errors.fullName ? 'border-red-500' : 'border-white/20'
                  } rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-white/40`}
                  placeholder="John Doe"
                  disabled={isSubmitting}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-transparent text-white border ${
                    errors.email ? 'border-red-500' : 'border-white/20'
                  } rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-white/40`}
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-transparent text-white border ${
                    errors.password ? 'border-red-500' : 'border-white/20'
                  } rounded-lg py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-white/40`}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-yellow-500"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-transparent text-white border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-white/20'
                  } rounded-lg py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-white/40`}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-yellow-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Contact Number & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Contact Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  name="contactNumber"
                  type="tel"
                  autoComplete="tel"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className={`w-full bg-transparent text-white border ${
                    errors.contactNumber ? 'border-red-500' : 'border-white/20'
                  } rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-white/40`}
                  placeholder="1234567890"
                  disabled={isSubmitting}
                />
              </div>
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.contactNumber}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full bg-transparent text-white border ${
                  errors.gender ? 'border-red-500' : 'border-white/20'
                } rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                disabled={isSubmitting}
              >
                <option value="" className="bg-gray-900">Select your gender</option>
                <option value="Male" className="bg-gray-900">Male</option>
                <option value="Female" className="bg-gray-900">Female</option>
                <option value="Non-binary" className="bg-gray-900">Non-binary</option>
                <option value="Other" className="bg-gray-900">Other</option>
                <option value="Prefer not to say" className="bg-gray-900">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.gender}
                </p>
              )}
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Register As
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full bg-transparent text-white border ${
                errors.role ? 'border-red-500' : 'border-white/20'
              } rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              disabled={isSubmitting}
            >
              <option value="" className="bg-gray-900">Choose your role</option>
              <option value="User" className="bg-gray-900">User</option>
              <option value="HotelOwner" className="bg-gray-900">Hotel Owner</option>
              <option value="Admin" className="bg-gray-900">Admin</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.role}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Login Link */}
          <p className="mt-1 text-center text-sm text-white/60">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-yellow-500 font-medium hover:underline"
            >
              Sign in here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}