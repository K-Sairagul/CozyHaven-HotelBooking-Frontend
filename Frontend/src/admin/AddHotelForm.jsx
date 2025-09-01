import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';

const AddHotelForm = () => {
  const { auth } = useAuth();
  const token = auth?.token;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    location: '',
    description: '',
    imageUrl: '',
    hotelOwnerId: '' // ✅ Add this
  });

  const [hotelOwners, setHotelOwners] = useState([]); // ✅ Dropdown data
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // ✅ Fetch hotel owners on mount
  useEffect(() => {
    const fetchHotelOwners = async () => {
      try {
        const res = await axios.get('https://localhost:7274/api/admin/hotelowners', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHotelOwners(res.data);
      } catch (err) {
        console.error('Error fetching hotel owners', err);
      }
    };
    fetchHotelOwners();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Hotel name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';
    if (!formData.hotelOwnerId) newErrors.hotelOwnerId = 'Please select a hotel owner';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://localhost:7274/api/Hotel',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSuccessMessage('Hotel added successfully!');
      setTimeout(() => navigate('/admin/hotels'), 3000); // Redirect to hotel list
    } catch (error) {
      console.error('Error adding hotel:', error);
      setServerError(error.response?.data?.message || 'Failed to add hotel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4">Add New Hotel</h2>

      {serverError && <Alert variant="danger">{serverError}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* Hotel Fields... (same as before) */}

        {/* Hotel Owner Dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>Assign Hotel Owner *</Form.Label>
          <Form.Select
            name="hotelOwnerId"
            value={formData.hotelOwnerId}
            onChange={handleChange}
            isInvalid={!!errors.hotelOwnerId}
          >
            <option value="">-- Select Hotel Owner --</option>
            {hotelOwners.map(owner => (
              <option key={owner.userId} value={owner.userId}>
                {owner.fullName} ({owner.email})
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.hotelOwnerId}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Other fields */}
        <Form.Group className="mb-3">
          <Form.Label>Hotel Name *</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address *</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            isInvalid={!!errors.address}
          />
          <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location *</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            isInvalid={!!errors.location}
          />
          <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            isInvalid={!!errors.description}
          />
          <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Image URL *</Form.Label>
          <Form.Control
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            isInvalid={!!errors.imageUrl}
          />
          <Form.Control.Feedback type="invalid">{errors.imageUrl}</Form.Control.Feedback>
          {formData.imageUrl && (
            <div className="mt-2">
              <img
                src={formData.imageUrl}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '200px' }}
              />
            </div>
          )}
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
          className="w-100 py-2"
        >
          {isLoading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
              Adding Hotel...
            </>
          ) : 'Add Hotel'}
        </Button>
      </Form>
    </Container>
  );
};

export default AddHotelForm;
