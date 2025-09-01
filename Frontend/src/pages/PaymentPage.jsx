import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7274';

export default function PaymentPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: ''
    });
    const [validationErrors, setValidationErrors] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: ''
    });

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API_BASE_URL}/api/Booking/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBooking(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load booking details");
                if (err.response?.status === 401) navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [bookingId, navigate]);

    const validateCardNumber = (number) => {
        // Remove all non-digit characters
        const cleaned = number.replace(/\D/g, '');
        
        // Check for all zeros or other obvious fake patterns
        if (/^0+$/.test(cleaned)) {
            return 'Invalid card number';
        }
        
        // Check for repeated digits (like 1111 1111 1111 1111)
        if (/^(\d)\1{3}(\s?\1{4}){3}$/.test(number)) {
            return 'Invalid card number';
        }
        
        // Check if it's a valid length (typically 13-19 digits)
        if (cleaned.length < 13 || cleaned.length > 19) {
            return 'Card number must be between 13 and 19 digits';
        }
        
        // Luhn algorithm check
        let sum = 0;
        let shouldDouble = false;
        
        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned.charAt(i));
            
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        
        return sum % 10 === 0 ? '' : 'Invalid card number';
    };

    const validateExpiryDate = (date) => {
        if (!date) return 'Expiry date is required';
        
        // Check format MM/YY
        if (!/^\d{2}\/\d{2}$/.test(date)) {
            return 'Invalid format. Use MM/YY';
        }
        
        const [month, year] = date.split('/').map(Number);
        
        // Check month is valid (1-12)
        if (month < 1 || month > 12) {
            return 'Invalid month';
        }
        
        // Check if card is expired
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return 'Card has expired';
        }
        
        return '';
    };

    const validateCVC = (cvc) => {
        if (!cvc) return 'CVC is required';
        if (!/^\d{3,4}$/.test(cvc)) return 'CVC must be 3 or 4 digits';
        return '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format card number with spaces every 4 digits
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\D/g, '')
                .replace(/(\d{4})(?=\d)/g, '$1 ')
                .trim()
                .substring(0, 19);
                
            setValidationErrors(prev => ({
                ...prev,
                cardNumber: validateCardNumber(formattedValue.replace(/\s/g, ''))
            }));
        }
        
        // Format expiry date as MM/YY
        if (name === 'expiryDate') {
            formattedValue = value.replace(/\D/g, '')
                .replace(/^(\d{2})/, '$1/')
                .substring(0, 5);
                
            setValidationErrors(prev => ({
                ...prev,
                expiryDate: validateExpiryDate(formattedValue)
            }));
        }
        
        // Format CVC (only digits, max 4)
        if (name === 'cvc') {
            formattedValue = value.replace(/\D/g, '').substring(0, 4);
            setValidationErrors(prev => ({
                ...prev,
                cvc: validateCVC(formattedValue)
            }));
        }

        setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields before submission
        const errors = {
            cardNumber: validateCardNumber(paymentData.cardNumber.replace(/\s/g, '')),
            expiryDate: validateExpiryDate(paymentData.expiryDate),
            cvc: validateCVC(paymentData.cvc)
        };
        
        setValidationErrors(errors);
        
        // Check if any errors exist
        if (Object.values(errors).some(error => error)) {
            return;
        }
        
        setProcessing(true);
        setError('');

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_BASE_URL}/api/payment`,
                {
                    bookingId: parseInt(bookingId),
                    amount: booking.totalAmount,
                    cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
                    expiryDate: paymentData.expiryDate,
                    cvc: paymentData.cvc
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                navigate(`/booking-confirmation/${bookingId}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Payment failed. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-md mx-auto mt-12 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="font-medium">Error</p>
            <p>{error}</p>
        </div>
    );

    if (!booking) return <div className="text-center mt-12">Booking not found</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Complete Payment</h1>
            
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Details</h2>
                <div className="space-y-2">
                    <p className="flex justify-between">
                        <span className="text-gray-600">Room:</span>
                        <span>{booking.room?.roomId || 'N/A'}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="text-gray-600">Check-in:</span>
                        <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="text-gray-600">Check-out:</span>
                        <span>{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                    </p>
                    <p className="flex justify-between font-bold text-lg mt-4 pt-2 border-t border-gray-200">
                        <span className="text-gray-800">Total:</span>
                        <span className="text-blue-600">${booking.totalAmount.toFixed(2)}</span>
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Information</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Card Number</label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={paymentData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            className={`w-full p-3 border ${validationErrors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            required
                        />
                        {validationErrors.cardNumber && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.cardNumber}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Expiry Date</label>
                            <input
                                type="text"
                                name="expiryDate"
                                value={paymentData.expiryDate}
                                onChange={handleInputChange}
                                placeholder="MM/YY"
                                className={`w-full p-3 border ${validationErrors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                required
                            />
                            {validationErrors.expiryDate && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.expiryDate}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">CVC</label>
                            <input
                                type="text"
                                name="cvc"
                                value={paymentData.cvc}
                                onChange={handleInputChange}
                                placeholder="123"
                                className={`w-full p-3 border ${validationErrors.cvc ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                required
                            />
                            {validationErrors.cvc && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.cvc}</p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing || Object.values(validationErrors).some(error => error)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50"
                    >
                        {processing ? 'Processing...' : 'Pay Now'}
                    </button>
                </form>
            </div>
        </div>
    );
}